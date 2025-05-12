<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;
use App\Models\Post;
use App\Events\CommentCreated;
class CommentController extends Controller
{
    private function getTopLevelCommentId($commentId)
    {
        $comment = Comment::find($commentId);

        while ($comment && $comment->parent_comment_id !== null) {
            $comment = Comment::find($comment->parent_comment_id);
        }

        return $comment ? $comment->id : $commentId;
    }
    public function createComment(Request $request)
    {
        $data = $request->validate([
            'post_id' => 'required',
            'parent_comment_id' => 'nullable|exists:comments,id',
            'content' => 'string|required',
        ]);
        $parentCommentId = $data['parent_comment_id'] ?? null;

        $topLevelCommentId = $parentCommentId
            ? $this->getTopLevelCommentId($parentCommentId)
            : null;

        $comment = Comment::create([
            'user_id' => $request->user()->id,
            'post_id' => $data['post_id'],
            'parent_comment_id' => $parentCommentId,
            'top_level_comment_id' => $topLevelCommentId, 
            'content' => $data['content'],
        ]);

        Post::where('id', $data['post_id'])->increment('comment_count');
        $comment->load('user');
        broadcast(new CommentCreated($comment));

        return response()->json(['comment' => $comment], 201);
    }

    public function index(Post $post)
    {
        $comments = $post->comments()
            ->whereNull('parent_comment_id') 
            ->with([
                'user',                  
                'replies.user',          
                'replies.topLevelComment', 
                'replies.parent.user',
            ])
            ->latest()
            ->get();

        return response()->json($comments);
    }
    public function getCommentById($id)
    {
        try {
            $comment = Comment::with(['replies.user', 'user'])->findOrFail($id);
            return response()->json($comment, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Comment not found'], 404);
        }
    }
}
