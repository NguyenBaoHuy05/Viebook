<?php

namespace App\Http\Controllers;

use \App\Models\Message;
use App\Events\MessageSent;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Events\MessageDeletedOrRestored;
use App\Models\Conversation;
use App\Models\ConversationUser;

class MessageController extends Controller
{
    public function sendMessage(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $message = Message::create([
            'user_id' => (int) $user->id,
            'conversation_id' => $request->conversation_id,
            'content' => $request->content,
        ]);
        Conversation::where('id', $request->conversation_id)
            ->update(['updated_at' => now()]);
        Log::info('Message: ' . $message);
        if (!$message) {
            Log::error('Failed to create message for user ID: ' . $user->id);
            return response()->json(['error' => 'Failed to send message'], 500);
        }
        broadcast(new MessageSent($message))->toOthers();

        return response()->json(['success' => true, 'message' => 'Message sent successfully.']);
    }
    public function getMessages(Request $request)
    {
        $messages = Message::where('conversation_id', $request->conversationId)
            ->orderBy('created_at', 'asc')
            ->get(['id', 'user_id', 'content', 'is_deleted']);

        return response()->json($messages);
    }
    public function destroy($id, $check)
    {
        $message = Message::find($id);
        if (!$message) {
            Log::error("Tin nhắn không tồn tại!");
            return response()->json(['error' => 'Tin nhắn không tồn tại!'], 404);
        }
        $message->update([
            'is_deleted' => $check
        ]);
        Log::info($message);
        broadcast(new MessageDeletedOrRestored($message))->toOthers();
        return response()->json(['success' => 'Message updated successfully.']);
    }
    public function getOrCreateConversation(Request $request)
    {
        $request->validate([
            'friend_id' => 'required|exists:users,id',
        ]);

        $userId = $request->user()->id;
        $friendId = $request->friend_id;

        $conversation = Conversation::where('type', 'private')
            ->whereHas('participants', function ($q) use ($userId, $friendId) {
                $q->whereIn('user_id', [$userId, $friendId]);
            }, '=', 2)
            ->withCount('participants')
            ->having('participants_count', '=', 2)
            ->first();

        if (!$conversation) {
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

        return response()->json([
            'id' => $conversation->id,
        ]);
    }
    public function getAllConversationsPrivate(Request $request)
    {
        $user = $request->user();

        $conversations = Conversation::where('type', 'private')
            ->whereHas('users', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->with([
                'users',
                'messages' => function ($q) {
                    $q->latest()->limit(1);
                }
            ])
            ->orderByDesc('updated_at')
            ->get();

        $result = $conversations->map(function ($conv) use ($user) {
            $friend = $conv->users->firstWhere('id', '!=', $user->id);

            $lastMessage = $conv->messages->first();

            return [
                'id' => $conv->id,
                'type' => $conv->type,
                'participant' => [
                    'id' => $friend->id,
                    'name' => $friend->name,
                    'avatar' => $friend->profile_picture,
                ],
                'last_message' => $lastMessage ? [
                    'id' => $lastMessage->id,
                    'content' => $lastMessage->content,
                    'created_at' => $lastMessage->created_at,
                    'user' => $lastMessage->user ? [
                        'id' => $lastMessage->user->id,
                        'name' => $lastMessage->user->name,
                        'avatar' => $lastMessage->user->profile_picture,
                    ] : null,
                ] : null,
                'updated_at' => $conv->updated_at,
            ];
        });

        return response()->json($result);
    }
}
