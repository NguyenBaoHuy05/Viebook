<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class FollowController extends Controller
{
    public function follow(Request $request, User $user){
        if ($request->user()->id === $user->id){
            return response()->json(['message' => 'Cannot follow yourself'], 400);
        }

        $request->user()->following()->attach($user->id);

        $user->increment('count_follow');

        return response()->json(['message' => 'Followed']);
    }

    public function unfollow(Request $request, User $user){
        $request->following()->detach($user->id);

        $user->decrement('count_follow');

        return response()->json(['message' => 'Unfollowed']);
    }

    public function followers(User $user){
        $followers = $user->followers()->get();
        return response()->json($followers);
    }
}
