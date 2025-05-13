<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Mockery\Matcher\Not;

class NotificationController extends Controller
{
    public function getAllNotification(Request $request)
    {
        $user = $request->user();
        $notifications = Notification::where("user_id", $user->id)
            ->with(['actor' => function ($query) {
                $query->select('id', 'name', 'username', 'profile_picture');
            }])
            // Laravel sẽ tự động xác định model dự 
            ->get();
        return response()->json(["notifications" => $notifications->map(function ($notification) {
            return [
                'id' => $notification->id,
                'type' => $notification->type,
                'actor' => [
                    'id' => $notification->actor->id,
                    'name' => $notification->actor->name,
                    'username' => $notification->actor->username,
                    'profile_picture' => $notification->actor->profile_picture,
                ],
                'target' => [
                    'id' => $notification->target->id,
                    'name' => $notification->target->name,
                ],
                'created_at' => $notification->created_at->toDateTimeString(),
            ];
        })]);
    }
}
