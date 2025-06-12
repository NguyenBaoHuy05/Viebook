<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class AccountController extends Controller
{
    public function show($username)
    {
        $retry = 0;
        while ($retry < 3) {
            try {
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
            } catch (\Exception $e) {
                $retry++;
                if ($retry >= 3) {
                    return response()->json(['user' => null, 'error' => 'Server error'], 500);
                }
                usleep(200000);
            }
        }
    }
    public function update(Request $request, $username)
    {
        $retry = 0;
        while ($retry < 3) {
            try {
                Log::info($request);
                $user = User::where('username', $username)->firstOrFail();

                if ($request->user()->id !== $user->id) {
                    return response()->json(['message' => 'Unauthorized'], 403);
                }
                Log::info($user);
                $user->update($request->only(['name', 'bio', 'location', 'profile_picture']));

                return response()->json(['message' => "Cập nhật thành công"]);
            } catch (\Exception $e) {
                $retry++;
                if ($retry >= 3) {
                    return response()->json(['error' => 'Server error'], 500);
                }
                usleep(200000);
            }
        }
    }
    public function searchUsers(Request $request)
    {
        $retry = 0;
        while ($retry < 3) {
            try {
                $user = $request->user();
                $query = $request->query('q'); // từ khóa tìm kiếm

                $users = User::Where('username', 'like', '%' . $query . '%')->where('username', '!=', $user->username)
                    ->limit(5)
                    ->get(['id', 'name', 'username', 'profile_picture']);

                return response()->json(['users' => $users]);
            } catch (\Exception $e) {
                $retry++;
                if ($retry >= 3) {
                    return response()->json(['error' => 'Server error'], 500);
                }
                usleep(200000);
            }
        }
    }
}
