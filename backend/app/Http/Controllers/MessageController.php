<?php

namespace App\Http\Controllers;

use \App\Models\Message;
use App\Events\MessageSent;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function sendMessage(Request $request)
    {
        // $request->validate([
        //     'conversation_id' => 'required|exists:conversations,id',
        //     'content' => 'required|string',
        // ]);
        $user = $request->user();
        Log::info('User ID: ' . $user->id);
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $message = Message::create([
            'user_id' => $user->id,
            'conversation_id' => $request->conversation_id,
            'content' => $request->content,
        ]);
        if (!$message) {
            Log::error('Failed to create message for user ID: ' . $user->id);
            return response()->json(['error' => 'Failed to send message'], 500);
        }
        broadcast(new MessageSent($message));

        return response()->json(['success' => true, 'message' => 'Message sent successfully.']);
    }
    public function getMessages(Request $request)
    {
        $messages = Message::where('conversation_id', $request->conversationId)
            ->orderBy('created_at', 'asc')
            ->get(['id', 'user_id', 'content']);

        return response()->json($messages);
    }
    public function getConversations(Request $request)
    {
        $conversations = Message::where('userId', $request->user()->id)
            ->distinct('conversation_id')
            ->get(['conversation_id']);

        return response()->json($conversations);
    }
    public function getConversationMessages(Request $request)
    {
        $messages = Message::where('conversation_id', $request->conversation_id)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($messages);
    }
    public function getConversationUsers(Request $request)
    {
        $users = Message::where('conversation_id', $request->conversation_id)
            ->distinct('user_id')
            ->get(['user_id']);

        return response()->json($users);
    }
    public function deleteMessage(Request $request)
    {
        $message = Message::find($request->message_id);
        if ($message) {
            $message->delete();
            return response()->json(['success' => true, 'message' => 'Message deleted successfully.']);
        } else {
            return response()->json(['success' => false, 'message' => 'Message not found.'], 404);
        }
    }
    public function updateMessage(Request $request)
    {
        $message = Message::find($request->message_id);
        if ($message) {
            $message->content = $request->content;
            $message->save();
            return response()->json(['success' => true, 'message' => 'Message updated successfully.']);
        } else {
            return response()->json(['success' => false, 'message' => 'Message not found.'], 404);
        }
    }
    public function markAsRead(Request $request)
    {
        $message = Message::find($request->message_id);
        if ($message) {
            $message->read_at = now();
            $message->save();
            return response()->json(['success' => true, 'message' => 'Message marked as read.']);
        } else {
            return response()->json(['success' => false, 'message' => 'Message not found.'], 404);
        }
    }
    public function markAsUnread(Request $request)
    {
        $message = Message::find($request->message_id);
        if ($message) {
            $message->read_at = null;
            $message->save();
            return response()->json(['success' => true, 'message' => 'Message marked as unread.']);
        } else {
            return response()->json(['success' => false, 'message' => 'Message not found.'], 404);
        }
    }
}
