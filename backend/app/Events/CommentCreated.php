<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CommentCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $comment;

    public function __construct($comment)
    {
        $this->comment = $comment;
    }

    public function broadcastOn()
    {
        return new Channel('post.' . $this->comment->post_id);
    }

    public function broadcastWith()
    {
        return [
            'id' => $this->comment->id,
            'username' => $this->comment->user->name,
            'content' => $this->comment->content,
            'created_at' => $this->comment->created_at->toISOString(),
        ];
    }
    public function broadcastAs()
    {
        return 'CommentCreated';
    }
}
