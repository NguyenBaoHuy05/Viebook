<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Follow;
use Illuminate\Support\Facades\Log;

class FollowController extends Controller
{
    public function follow(Request $request)
    {
        $followerId = $request->user()->id;
        $followedId = $request->input('followed_id');

        if ($followerId == $followedId) {
            return response()->json(['message' => 'Không thể tự follow chính mình'], 400);
        }
        Follow::firstOrCreate(['follower_id' => $followerId, 'followed_id' => $followedId]);

        User::where('id', $followedId)->increment('count_follower');
        User::where('id', $followerId)->increment('count_follow');

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
