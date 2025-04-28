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
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $message = Message::create([
            'user_id' => (int) $user->id,
            'conversation_id' => $request->conversation_id,
            'content' => $request->content,
        ]);
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
            ->get(['id', 'user_id', 'content']);

        return response()->json($messages);
    }
}
