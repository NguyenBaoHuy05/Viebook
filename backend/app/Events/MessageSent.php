<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;
    public function __construct(Message $message)
    {
        $this->message = $message;
        Log::info('Message Sent: ', ['message' => $message]);
    }
    public function broadcastOn(): array
    {
        return [
            new Channel('chat.' . $this->message->conversation_id),
        ];
    }
    public function broadcastAs(): string
    {
        return 'message.sent';
    }
}
