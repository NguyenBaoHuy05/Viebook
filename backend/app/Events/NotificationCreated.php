<?php

namespace App\Events;

use App\Models\Notification;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NotificationCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $notification;
    public $userId;

    public function __construct(Notification $notification, $userId)
    {
        $this->notification = $notification;
        $this->userId = $userId;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('notifications.' . $this->userId);
    }

    public function broadcastAs()
    {
        return 'notification.created';
    }
    public function broadcastWith()
    {
        return [
            'id' => $this->notification->id,
            'type' => $this->notification->type,
            'message' => "Bạn có thông báo mới",
            'actor' => [
                'id' => $this->notification->actor->id,
                'name' => $this->notification->actor->name
            ],
            'target' => [
                'id' => $this->notification->target->id,
                'name' => $this->notification->target->name
            ],
            'created_at' => $this->notification->created_at->toDateTimeString(),

        ];
    }
}
