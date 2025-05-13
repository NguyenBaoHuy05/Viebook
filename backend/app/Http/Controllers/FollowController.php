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
        $user = $request->user();
        $followedId = $request->input('followed_id');

        if ($user->id == $followedId) {
            return response()->json(['message' => 'Không thể tự follow chính mình'], 400);
        }

        // Kiểm tra follow đã tồn tại chưa
        $follow = Follow::where('follower_id', $user->id)
            ->where('followed_id', $followedId)
            ->first();

        if ($follow) {
            return response()->json(['message' => 'Đã follow rồi'], 200);
        }

        // Tạo follow
        $newFollow = Follow::create([
            'follower_id' => $user->id,
            'followed_id' => $followedId,
        ]);

        // Tăng số người follow
        User::where('id', $followedId)->increment('count_follower');
        User::where('id', $user->id)->increment('count_follow');

        // Tạo notification
        $notification = Notification::create([
            'user_id' => $followedId,            // người nhận
            'actor_id' => $user->id,             // người thực hiện hành động
            'type' => 'follow',
            'target_type' => User::class,
            'target_id' => $user->id,            // target là người follow
        ]);

        broadcast(new NotificationCreated($notification, $followedId));

        return response()->json(['message' => 'Follow thành công']);
    }


    public function unfollow(Request $request)
    {
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
    }


    public function checkFollow(Request $request)
    {
        $followerId = $request->user()->id;
        $followedId = $request->query('followed_id');

        $isFollowing = Follow::where('follower_id', $followerId)
            ->where('followed_id', $followedId)
            ->exists();

        return response()->json(['is_following' => $isFollowing]);
    }
}
