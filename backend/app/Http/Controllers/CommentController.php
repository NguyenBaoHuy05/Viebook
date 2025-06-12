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
        $retry = 0;
        while ($retry < 3) {
            try {
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
                $comment->load([
                    'user',
                    'replies.user',
                    'replies.topLevelComment',
                    'replies.parent.user',
                ]);
                broadcast(new CommentCreated($comment));
                return response()->json(['comment' => $comment], 201);
            } catch (\Exception $e) {
                $retry++;
                if ($retry >= 3) {
                    return response()->json(['comment' => null, 'error' => 'Server error'], 500);
                }
                usleep(200000);
            }
        }
    }

    public function index(Post $post)
    {
        $retry = 0;
        while ($retry < 3) {
            try {
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
            } catch (\Exception $e) {
                $retry++;
                if ($retry >= 3) {
                    return response()->json(['error' => 'Server error'], 500);
                }
                usleep(200000);
            }
        }
    }
    public function getCommentById($id)
    {
        $retry = 0;
        while ($retry < 3) {
            try {
                $comment = Comment::with(['replies.user', 'user'])->findOrFail($id);
                return response()->json($comment, 200);
            } catch (\Exception $e) {
                $retry++;
                if ($retry >= 3) {
                    return response()->json(['error' => 'Comment not found'], 404);
                }
                usleep(200000);
            }
        }
    }
}
