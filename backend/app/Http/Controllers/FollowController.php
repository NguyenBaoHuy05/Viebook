<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Follow;
use Illuminate\Support\Facades\Log;
use App\Models\Notification;
use App\Events\NotificationCreated;

class FollowController extends Controller
{
    public function follow(Request $request)
    {
        $retry = 0;
        while ($retry < 3) {
            try {
                $user = $request->user();
                $followedId = $request->input('followed_id');

                if ($user->id == $followedId) {
                    return response()->json(['message' => 'Không thể tự follow chính mình'], 400);
                }


                $follow = Follow::where('follower_id', $user->id)
                    ->where('followed_id', $followedId)
                    ->first();

                if ($follow) {
                    return response()->json(['message' => 'Đã follow rồi'], 200);
                }

                $newFollow = Follow::create([
                    'follower_id' => $user->id,
                    'followed_id' => $followedId,
                ]);

                User::where('id', $followedId)->increment('count_follower');
                User::where('id', $user->id)->increment('count_follow');

                $notification = Notification::create([
                    'user_id' => $followedId,            // người nhận
                    'actor_id' => $user->id,             // người thực hiện hành động
                    'type' => 'follow',
                    'target_type' => User::class,
                    'target_id' => $followedId,
                ]);

                broadcast(new NotificationCreated($notification, $followedId));

                return response()->json(['message' => 'Follow thành công']);
            } catch (\Exception $e) {
                $retry++;
                if ($retry >= 3) {
                    return response()->json(['message' => 'Server error'], 500);
                }
                usleep(200000);
            }
        }
    }


    public function unfollow(Request $request)
    {
        $retry = 0;
        while ($retry < 3) {
            try {
                $followerId = $request->user()->id;
                $followedId = $request->query('followed_id');

                $follow = Follow::where('follower_id', $followerId)
                    ->where('followed_id', $followedId)
                    ->first();
                Log::info("Giá trị follow: " . $follow);
                if ($follow) {
                    $follow->delete();

                    User::where('id', $followedId)->decrement('count_follower');
                    User::where('id', $followerId)->decrement('count_follow');

                    return response()->json(['message' => 'Unfollowed']);
                }

                return response()->json(['message' => 'Ko có following'], 400);
            } catch (\Exception $e) {
                $retry++;
                if ($retry >= 3) {
                    return response()->json(['message' => 'Server error'], 500);
                }
                usleep(200000);
            }
        }
    }


    public function checkFollow(Request $request)
    {
        $retry = 0;
        while ($retry < 3) {
            try {
                $followerId = $request->user()->id;
                $followedId = $request->query('followed_id');

                $isFollowing = Follow::where('follower_id', $followerId)
                    ->where('followed_id', $followedId)
                    ->exists();

                return response()->json(['is_following' => $isFollowing]);
            } catch (\Exception $e) {
                $retry++;
                if ($retry >= 3) {
                    return response()->json(['is_following' => null, 'error' => 'Server error'], 500);
                }
                usleep(200000);
            }
        }
    }
}
