<?php

namespace App\Http\Controllers;
use App\Models\Post;
use Illuminate\Http\Request;
use App\Models\PostReact;

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
    public function toggleReact(Post $post, Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $react = PostReact::where('post_id', $post->id)->where('user_id', $user->id)->first();

        if ($react) {
            $react->delete();
            $post->decrement('react_count');
        } else {    
            PostReact::create([
                'post_id' => $post->id,
                'user_id' => $user->id,
                'react_type' => 'like',
            ]);
            $post->increment('react_count');
        }

        return response()->json(['status' => $react ? 'unliked' : 'liked']);
    }   

}
