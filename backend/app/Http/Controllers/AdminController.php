<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Models\Post;

class AdminController extends Controller
{
    public function getAllUsers()
    {
        $users = User::orderByDesc('count_follower') // Sắp xếp lượt follow giảm dần
        ->orderByDesc('count_friend') // Sau đó sắp xếp lượt friend giảm dần
        ->get();

        return response()->json($users);
    }

    public function getAllPosts()
    {
        $posts = Post::with('user:id,name')
        ->orderByDesc('share_count') // Sắp xếp lượt share giảm dần
        ->orderByDesc('comment_count') // Sau đó sắp xếp lượt comment giảm dần
        ->orderByDesc('react_count') // Cuối cùng sắp xếp lượt react giảm dần
        ->get();
        return response()->json($posts);
    }

    public function updateBlock(Request $request, User $user)
{
    if ($user->role === 'admin') {
        return response()->json(['error' => 'Không thể block admin'], 403);
    }

    $isBlocked = filter_var($request->input('is_blocked'), FILTER_VALIDATE_BOOLEAN);
    $user->is_blocked = $isBlocked;
    $user->save();

    return response()->json(['message' => 'Cập nhật trạng thái thành công']);
}

}