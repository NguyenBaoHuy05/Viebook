<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $notification = $request->user()->notifications()->with('actor')->latest()->get();

        return response()->json($notification);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required|string',
            'title' => 'required|string',
            'type_content' => 'nullable|string',
        ]);

        $post = $request->user()->posts()->create($validated);

        // Tạo thông báo cho tất cả người theo dõi
        $followers = $request->user()->followers;
        foreach ($followers as $follower) {
            Notification::create([
                'actor_id' => $request->user()->id, // Người đăng bài
                'user_id' => $follower->id, // Người theo dõi
                'type' => 'new_post',
                'target_id' => $post->id,
                'isRead' => false,
            ]);
        }

        return response()->json($post, 201);
    }

    public function update(Request $request, Post $post)
    {
        if ($post->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    
        $validated = $request->validate([
            'content' => 'required|string',
            'type_content' => 'nullable|string',
        ]);
    
        $post->update($validated);
    
        // Cập nhật thông báo liên quan đến bài đăng
        Notification::where('target_id', $post->id)
            ->where('type', 'new_post')
            ->update([
                'type' => 'post_updated',
                'isRead' => false, // Đặt lại thành chưa đọc
                'updated_at' => now(),
            ]);
    
        return response()->json($post);
    }

    public function destroy(Request $request, Post $post)
    {
        if ($post->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    
        // Xóa các thông báo liên quan đến bài đăng
        Notification::where('target_id', $post->id)
            ->whereIn('type', ['new_post', 'post_updated'])
            ->delete();
        
        return response()->json(['message' => 'Post deleted']);
    }    public function markAsRead(Request $request, Notification $notification)
    {
        if ($notification->user_id !== $request->user()->id){
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $notification->update(['isRead' => true]);

        return response()->json(['message' => 'Marked as read']);
    }

}
