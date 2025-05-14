<?php

namespace App\Http\Controllers;
use App\Models\Post;
use Illuminate\Http\Request;
use App\Models\PostReact;
use App\Models\Follow;
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
            'share_post_id' => 'nullable|exists:posts,id',
            'privacy' => 'nullable|string'
        ]); 
        $post = Post::create([
            'user_id' => $request->user()->id,
            'share_post_id' => $data['share_post_id'] ?? null,
            'type_content' => $data['typeContent'],
            'title' => $data['title'],
            'content' => $data['content'] ?? '',
            'privacy' => $data['privacy'] ?? ''
        ]);
        if (isset($data['share_post_id'])) {
            Post::where('id', $data['share_post_id'])->increment('share_count');
        }

        return response()->json(['post' => $post], 201);
    }
    public function index(Request $request) {
        $user = $request->user();
        $query = Post::with('user');

        if ($request->has('user')) {
            $query->where('user_id', $request->query('user'));
        }

        $query->where(function($q) use ($user) {
            $q->where('privacy', 'public');
            if ($user) {
                $friendIds = $user->allFriendIds();
                $q->orWhere(function($q2) use ($friendIds) {
                    $q2->where('privacy', 'friends')
                       ->whereIn('user_id', $friendIds);
                });

                $q->orWhere(function($q2) use ($user) {
                    $q2->where('privacy', 'private')
                       ->where('user_id', $user->id);
                });
            }
        });

        $friendIds = $user ? $user->allFriendIds()->toArray() : [];
        $followingIds = $user
            ? Follow::where('follower_id', $user->id)->pluck('followed_id')->toArray()
            : [];

        $friendIdsStr = !empty($friendIds) ? implode(',', $friendIds) : '0';
        $followingIdsStr = !empty($followingIds) ? implode(',', $followingIds) : '0';

        $query->selectRaw('posts.*, 
            (CASE WHEN FIND_IN_SET(user_id, ?) THEN 1000 ELSE 0 END) +
            (CASE WHEN FIND_IN_SET(user_id, ?) THEN 500 ELSE 0 END) +
            (react_count * 10) +
            (comment_count * 5) +
            (share_count * 8) +
            (SELECT COUNT(*) FROM follows WHERE followed_id = posts.user_id) * 0.5 -
            TIMESTAMPDIFF(MINUTE, posts.created_at, NOW())
            AS score', [
                $friendIdsStr,
                $followingIdsStr
            ])
            ->orderByDesc('score');

        $posts = $query->paginate(15);
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
    public function getReact(Post $post, Request $request)
    {
        $user = $request->user();
        $react = PostReact::where('post_id', $post->id)->where('user_id', $user->id)->first();
        return response()->json(['status' => $react ? 1 : 0]);
    }
    public function getPostWithID(Post $post)
    {
        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }
        $post->load('user'); 
        return response()->json(['data' => $post]);
    }

}
