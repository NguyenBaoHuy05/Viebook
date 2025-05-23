<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class AccountController extends Controller
{
    public function show($username)
    {
        $user = User::where('username', $username)->firstOrFail();
        return response()->json([
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'name' => $user->name,
                'profile_picture' => $user->profile_picture,
                'bio' => $user->bio,
                'location' => $user->location,
                'count_follow' => $user->count_follow,
                'count_friend' => $user->count_friend,
                'count_follower' => $user->count_follower,
                'role' => $user->role,
            ]
        ]);
    }
    public function update(Request $request, $username)
    {
        Log::info($request);
        $user = User::where('username', $username)->firstOrFail();

        if ($request->user()->id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        Log::info($user);
        $user->update($request->only(['name', 'bio', 'location', 'profile_picture']));

        return response()->json(['message' => "Cập nhật thành công"]);
    }
    public function searchUsers(Request $request)
    {
        $user = $request->user();
        $query = $request->query('q'); // từ khóa tìm kiếm

        $users = User::Where('username', 'like', '%' . $query . '%')->where('username', '!=', $user->username)
            ->limit(5)
            ->get(['id', 'name', 'username', 'profile_picture']);

        return response()->json(['users' => $users]);
    }
}
