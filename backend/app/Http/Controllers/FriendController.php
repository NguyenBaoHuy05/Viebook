<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\ConversationUser;
use Illuminate\Http\Request;
use App\Models\Friend;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\Notification;
use App\Events\NotificationCreated;


class FriendController extends Controller
{
    // Thêm breaker cho tất cả public function
    public function getStatusFriend(Request $request)
    {
        $retry = 0;
        while ($retry < 3) {
            try {
                // validate lấy từ body chớ không phải từ param
                $userId = $request->user()->id;
                $friendId = $request->query('friend_id');

                if (!$friendId || !User::where('id', $friendId)->exists()) {
                    return response()->json(['message' => 'ID bạn bè không hợp lệ'], 422);
                }

                $friend = Friend::where(function ($q) use ($userId, $friendId) {
                    $q->where('user_id', $userId)
                        ->where('friend_id', $friendId);
                })->first();
                if ($friend) {
                    switch ($friend->status) {
                        case 'pending':
                            $status = 1;
                            break;
                        case 'accepted':
                            $status = 2;
                            break;
                        case 'blocked':
                            $status = 3;
                            break;
                        case 'deleted':
                            $status = 4;
                            break;
                        default:
                            $status = 0;
                    }
                } else {
                    $status = 0;
                }
                if ($friend)
                    return response()->json(['status' => $status]);
                $friend_1 = Friend::where(function ($q) use ($userId, $friendId) {
                    $q->where('user_id', $friendId)
                        ->where('friend_id', $userId);
                })->first();
                if ($friend_1) {
                    switch ($friend_1->status) {
                        case 'pending':
                            $status = 5;
                            break;
                        case 'accepted':
                            $status = 6;
                            break;
                        case 'blocked':
                            $status = 7;
                            break;
                        case 'deleted':
                            $status = 8;
                            break;
                        default:
                            $status = 0;
                    }
                } else {
                    $status = 0;
                }
                return response()->json(['status' => $status]);
            } catch (\Exception $e) {
                $retry++;
                if ($retry >= 3) {
                    return response()->json(['status' => null, 'error' => 'Server error'], 500);
                }
                usleep(200000);
            }
        }
    }
    public function addFriend(Request $request)
    {
        $retry = 0;
        while ($retry < 3) {
            try {
                $request->validate([
                    'friend_id' => 'required|exists:users,id',
                ]);
                $userId = $request->user()->id;
                $friendId = $request->friend_id;
                if ($userId === $friendId)
                    return response()->json(['message' => "Không thể kết bạn với chính mình"]);
                $exists = Friend::where(function ($q) use ($userId, $friendId) {
                    $q->where('user_id', $userId)
                        ->where('friend_id', $friendId);
                })->orWhere(function ($q) use ($userId, $friendId) {
                    $q->where('user_id', $friendId)
                        ->where('friend_id', $userId);
                })->first();
                if ($exists) {
                    if ($exists->status !== 'deleted') {
                        return response()->json(['message' => 0], 409);
                    }
                    if ($exists->status === 'deleted') {
                        $exists->update(['status' => 'pending']);
                        $notification = Notification::create([
                            'user_id' => $friendId,            // người nhận
                            'actor_id' => $userId,             // người thực hiện hành động
                            'type' => 'addFriend',
                            'target_type' => User::class,
                            'target_id' => $friendId,
                        ]);
                        broadcast(new NotificationCreated($notification, $friendId));
                        return response()->json(['message' => 1], 201);
                    }
                }
                Friend::create([
                    'user_id' => $userId,
                    'friend_id' => $friendId,
                    'status' => 'pending',
                ]);
                $notification = Notification::create([
                    'user_id' => $friendId,            // người nhận
                    'actor_id' => $userId,             // người thực hiện hành động
                    'type' => 'addFriend',
                    'target_type' => User::class,
                    'target_id' => $friendId,
                ]);
                broadcast(new NotificationCreated($notification, $friendId));
                return response()->json(['message' => 1], 201);
            } catch (\Exception $e) {
                $retry++;
                if ($retry >= 3) {
                    return response()->json(['status' => null, 'error' => 'Server error'], 500);
                }
                usleep(200000);
            }
        }
    }

    public function deleteFriend($friendId)
    {
        $retry = 0;
        while ($retry < 3) {
            try {
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
                $friend->update(['status' => 'deleted']);
                $notification = Notification::create([
                    'user_id' => $friendId,            // người nhận
                    'actor_id' => $userId,             // người thực hiện hành động
                    'type' => 'deleteFriend',
                    'target_type' => User::class,
                    'target_id' => $friendId,
                ]);
                broadcast(new NotificationCreated($notification, $friendId));
                return response()->json(['message' => 'Đã xóa bạn bè']);
            } catch (\Exception $e) {
                $retry++;
                if ($retry >= 3) {
                    return response()->json(['status' => null, 'error' => 'Server error'], 500);
                }
                usleep(200000);
            }
        }
    }
    public function getPendingFriendList(Request $request)
    {
        $retry = 0;
        while ($retry < 3) {
            try {
                $userId = $request->user()->id;

                $pendingFriends = Friend::where('friend_id', $userId)
                    ->where('status', 'pending')
                    ->with('user') // eager load user model
                    ->get()
                    ->map(function ($friend) {
                        return [
                            'id' => $friend->user_id,
                            'name' => $friend->user->name,
                            'username' => $friend->user->username,
                            'avatar' => $friend->user->profile_picture,
                            'requested_at' => $friend->created_at,
                        ];
                    });

                return response()->json([
                    'pending_friends' => $pendingFriends
                ]);
            } catch (\Exception $e) {
                $retry++;
                if ($retry >= 3) {
                    return response()->json(['status' => null, 'error' => 'Server error'], 500);
                }
                usleep(200000);
            }
        }
    }
    public function acceptFriend(Request $request)
    {
        $retry = 0;
        while ($retry < 3) {
            try {
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
                $notification = Notification::create([
                    'user_id' => $friendId,            // người nhận
                    'actor_id' => $userId,             // người thực hiện hành động
                    'type' => 'acceptFriend',
                    'target_type' => User::class,
                    'target_id' => $friendId,
                ]);
                broadcast(new NotificationCreated($notification, $friendId));
                User::where('id', $userId)->increment('count_friend');
                User::where('id', $friendId)->increment('count_friend');
                $existingConversation = Conversation::where('type', 'private')
                    ->whereHas('participants', function ($q) use ($userId) {
                        $q->where('user_id', $userId);
                    })
                    ->whereHas('participants', function ($q) use ($friendId) {
                        $q->where('user_id', $friendId);
                    })
                    ->withCount('participants')
                    ->having('participants_count', '=', 2)
                    ->first();

                if (!$existingConversation) {
                    $conversation = Conversation::create([
                        'type' => 'private',
                        'creator_id' => $userId,
                    ]);

                    ConversationUser::create([
                        'conversation_id' => $conversation->id,
                        'user_id' => $userId,
                    ]);

                    ConversationUser::create([
                        'conversation_id' => $conversation->id,
                        'user_id' => $friendId,
                    ]);
                }

                return response()->json(['message' => 'Đã chấp nhận lời mời kết bạn']);
            } catch (\Exception $e) {
                $retry++;
                if ($retry >= 3) {
                    return response()->json(['status' => null, 'error' => 'Server error'], 500);
                }
                usleep(200000);
            }
        }
    }

    public function getFriendsList(Request $request)
    {
        $retry = 0;
        while ($retry < 3) {
            try {
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
            } catch (\Exception $e) {
                $retry++;
                if ($retry >= 3) {
                    return response()->json(['status' => null, 'error' => 'Server error'], 500);
                }
                usleep(200000);
            }
        }
    }
    public function getInfoFriend(Request $request)
    {
        $retry = 0;
        while ($retry < 3) {
            try {
                $userId = $request->user()->id;
                $friendId = $request->query('friend_id');

                $friend = Friend::where(function ($q) use ($userId, $friendId) {
                    $q->where('user_id', $userId)->where('friend_id', $friendId);
                })->orWhere(function ($q) use ($userId, $friendId) {
                    $q->where('user_id', $friendId)->where('friend_id', $userId);
                })->first();

                if (!$friend) {
                    return response()->json(['message' => 'Không tìm thấy bạn bè'], 404);
                }

                $otherUserId = $friend->user_id == $userId ? $friend->friend_id : $friend->user_id;

                $otherUser = User::find($otherUserId);

                return response()->json([
                    'friend' => [
                        'id' => $otherUser->id,
                        'username' => $otherUser->username,
                        'name' => $otherUser->name,
                        'avatar' => $otherUser->profile_picture,
                        'requested_at' => $friend->created_at,
                    ]
                ]);
            } catch (\Exception $e) {
                $retry++;
                if ($retry >= 3) {
                    return response()->json(['status' => null, 'error' => 'Server error'], 500);
                }
                usleep(200000);
            }
        }
    }
    public function blockFriend(Request $request)
    {
        $retry = 0;
        while ($retry < 3) {
            try {
                $userId = $request->user()->id;
                $friendId = $request->friend_id;

                $friend = Friend::where(function ($q) use ($userId, $friendId) {
                    $q->where('user_id', $userId)->where('friend_id', $friendId);
                })->orWhere(function ($q) use ($userId, $friendId) {
                    $q->where('user_id', $friendId)->where('friend_id', $userId);
                })->first();

                $friend->update(['status' => 'blocked']);
                return response()->json(["message" => "Block thành công"]);
            } catch (\Exception $e) {
                $retry++;
                if ($retry >= 3) {
                    return response()->json(['status' => null, 'error' => 'Server error'], 500);
                }
                usleep(200000);
            }
        }
    }
}
