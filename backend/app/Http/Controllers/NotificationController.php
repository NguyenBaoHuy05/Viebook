<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class NotificationController extends Controller
{
    public function getAllNotification(Request $request)
    {
        $user = $request->user();
        $notifications = Notification::where("user_id", $user->id)
            ->with(['actor' => function ($query) {
                $query->select('id', 'name', 'username', 'profile_picture');
            }])
            ->orderBy('created_at', 'desc')
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
                'is_read' => $notification->is_read,
                'created_at' => $notification->created_at->toDateTimeString(),
            ];
        })]);
    }
    public function changeIsRead(Request $request)
    {
        $user = $request->user();
        $id = $request->idNoti;
        Log::info("Có chuyển1");
        $notification = Notification::where('id', $id)->where('user_id', $user->id)->first();
        if (!$notification) {
            return response()->json(['message' => 'Không xác thực được'], 404);
        }
        $notification->update(['is_read' => true]);
        Log::info("Có chuyển" . $notification);
        return response()->json(['message' => 'Success']);
    }
}
