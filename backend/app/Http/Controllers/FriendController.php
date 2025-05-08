<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Friend;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class FriendController extends Controller
{
    public function getStatusFriend(Request $request)
    {
        // validate lấy từ body chớ không phải từ param
        $userId = $request->user()->id;
        $friendId = $request->query('friend_id');

        if (!$friendId || !User::where('id', $friendId)->exists()) {
            return response()->json(['message' => 'ID bạn bè không hợp lệ'], 422);
        }

        $friend  = Friend::where(function ($q) use ($userId, $friendId) {
            $q->where('user_id', $userId)
                ->where('friend_id', $friendId);
        })->orWhere(function ($q) use ($userId, $friendId) {
            $q->where('user_id', $friendId)
                ->where('friend_id', $userId);
        })->first();
        if ($friend) {
            switch ($friend->status) {
                case 'pending':
                    $status = 1;
                    break;
                case 'accepted':
                    $status = 2;
                    break;
                case 'rejected':
                    $status = 3;
                    break;
                default:
                    $status = 0;
            }
        } else {
            $status = 0;
        }

        return response()->json(['status' => $status]);
    }
    public function addFriend(Request $request)
    {
        $request->validate([
            'friend_id' => 'required|exists:users,id',
        ]);

        $userId = $request->user()->id;
        $friendId = $request->friend_id;

        if ($userId === $friendId) return response()->json(['message' => "Không thể kết bạn với chính mình"]);
        $exists = Friend::where(function ($q) use ($userId, $friendId) {
            $q->where('user_id', $userId)
                ->where('friend_id', $friendId);
        })->orWhere(function ($q) use ($userId, $friendId) {
            $q->where('user_id', $friendId)
                ->where('friend_id', $userId);
        })->exists();

        if ($exists) {
            return response()->json(['message' => 0], 409);
        }

        Friend::create([
            'user_id' => $userId,
            'friend_id' => $friendId,
            'status' => 'pending',
        ]);

        return response()->json(['message' => 1], 201);
    }

    public function deleteFriend($friendId)
    {

        $userId = Auth::id();

        if (!User::find($friendId)) {
            return response()->json(['message' => 'ID bạn bè không hợp lệ'], 422);
        }

        $friend = Friend::where(function ($q) use ($userId, $friendId) {
            $q->where('user_id', $userId)->where('friend_id', $friendId);
        })->orWhere(function ($q) use ($userId, $friendId) {
            $q->where('user_id', $friendId)->where('friend_id', $userId);
        })->first();
        if ($friend->status === 'accepted') {
            User::where('id', $userId)->decrement('count_friend');
            User::where('id', $friendId)->decrement('count_friend');
        }

        if (!$friend) {
            return response()->json(['message' => 'Không tìm thấy bạn bè'], 404);
        }

        $friend->delete();


        return response()->json(['message' => 'Đã xóa bạn bè']);
    }
    public function getPendingFriendList(Request $request)
    {
        $userId = $request->user()->id;

        $pendingFriends = Friend::where('friend_id', $userId)
            ->where('status', 'pending')
            ->with('user') // eager load user model
            ->get()
            ->map(function ($friend) {
                return [
                    'id' => $friend->user_id,
                    'name' => $friend->user->name,
                    'requested_at' => $friend->created_at,
                ];
            });

        return response()->json([
            'pending_friends' => $pendingFriends
        ]);
    }
    public function acceptFriend(Request $request)
    {
        $request->validate([
            'friend_id' => 'required|exists:users,id',
        ]);

        $userId = $request->user()->id;
        $friendId = $request->friend_id;

        $friendRequest = Friend::where('user_id', $friendId)
            ->where('friend_id', $userId)
            ->where('status', 'pending')
            ->first();

        if (!$friendRequest) {
            return response()->json(['message' => 'Không tìm thấy lời mời kết bạn'], 404);
        }

        $friendRequest->update(['status' => 'accepted']);
        if ($friendRequest) {
            User::where('id', $userId)->increment('count_friend');
            User::where('id', $friendId)->increment('count_friend');
        }

        return response()->json(['message' => 'Đã chấp nhận lời mời kết bạn']);
    }

    public function getFriendsList(Request $request)
    {
        $userId = $request->user()->id;
        $friendId = $request->query('friend_id');

        $targetId = $userId == $friendId ? $userId : $friendId;

        $friends = Friend::where(function ($query) use ($targetId) {
            $query->where('user_id', $targetId)
                ->orWhere('friend_id', $targetId);
        })
            ->where('status', 'accepted')
            ->latest()
            ->take(5)
            ->with(['user', 'friend']) // eager load để tránh lỗi N+1
            ->get()
            ->map(function ($friend) use ($targetId) {
                // Xác định bạn bè là người còn lại trong mối quan hệ
                $friendUser = $friend->user_id == $targetId ? $friend->friend : $friend->user;
                return [
                    'id' => $friendUser->id,
                    'username' => $friendUser->username,
                    'name' => $friendUser->name,
                    'avatar' => $friendUser->profile_picture,
                    'requested_at' => $friend->updated_at,
                ];
            });

        return response()->json([
            'friends' => $friends
        ]);
    }
}
