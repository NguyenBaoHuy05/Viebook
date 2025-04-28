<?php

namespace App\Http\Controllers;
use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function createPost(Request $request)
    {
        if (!$request->user()) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
        $data = $request->validate([
            'typeContent' => 'string|max:255',
            'title' => 'required|string|max:255',
            'content' => 'nullable|string', 
        ]); 
        $post = Post::create([
            'user_id' => $request->user()->id,
            'type_content' => $data['typeContent'],
            'title' => $data['title'],
            'content' => $data['content'] ?? '',
        ]);

        return response()->json(['post' => $post], 201);
    }
    public function index() {
        $posts = Post::with('user')->latest()->paginate(15);
        return response()->json($posts);
    }
}
