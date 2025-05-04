<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;
use App\Models\Post;
class CommentController extends Controller
{
    public function createComment(Request $request) {
        $data = $request->validate([
            'post_id' => 'required',
            'parent_comment_id' => 'nullable',
            'content' => 'string|required',
        ]); 
    
        $comment = Comment::create([
            'user_id' => $request->user()->id,
            'post_id' => $data['post_id'],
            'parent_comment_id' => $data['parent_comment_id'] ?? null,
            'content' => $data['content']
        ]);
    
        $comment->load('user'); 
    
        return response()->json(['comment' => $comment], 201);
    }
        public function index(Post $post)
        {
            $comments = $post->comments()->with('user')->latest()->get();
            return response()->json($comments);
        }
    
}
