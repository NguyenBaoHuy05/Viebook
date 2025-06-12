<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Save;
use App\Models\Post;
use Illuminate\Support\Facades\Auth;

class SaveController extends Controller
{
    public function toggleSave(Request $request, $postId)
    {
        $retry = 0;
        while ($retry < 3) {
            try {
                $user = $request->user();
                $save = Save::where('user_id', $user->id)->where('post_id', $postId)->first();
                if ($save) {
                    $save->delete();
                    return response()->json(['saved' => false]);
                } else {
                    Save::create([
                        'user_id' => $user->id,
                        'post_id' => $postId,
                    ]);
                    return response()->json(['saved' => true]);
                }
            } catch (\Exception $e) {
                $retry++;
                if ($retry >= 3) {
                    return response()->json(['saved' => null, 'error' => 'Server error'], 500);
                }
                usleep(200000); // 200ms
            }
        }
    }

    public function getSavedPosts(Request $request)
    {
        $retry = 0;
        $posts = collect([]);
        while ($retry < 3) {
            try {
                $user = $request->user();
                $saves = Save::where('user_id', $user->id)->with('post.user')->latest()->get();
                $posts = $saves->map(function ($save) {
                    $post = $save->post;
                    return [
                        'id' => $post->id,
                        'name' => $post->user->name,
                        'userId' => $post->user->id,
                        'logo' => $post->user->profile_picture ? $post->user->profile_picture : "https://github.com/shadcn.png",
                        'title' => $post->title,
                        'content' => $post->content,
                        'commentCount' => $post->comment_count,
                        'reactCount' => $post->react_count,
                        'shareCount' => $post->share_count,
                        'date' => $post->created_at->format('d/m/Y'),
                        'sharePostID' => $post->share_post_id,
                    ];
                });
                break;
            } catch (\Exception $e) {
                $retry++;
                if ($retry >= 3) {
                    return response()->json(['posts' => []], 500);
                }
                usleep(200000); // 200ms
            }
        }
        return response()->json(['posts' => $posts]);
    }

    public function isSaved(Request $request, $postId)
    {
        $retry = 0;
        while ($retry < 3) {
            try {
                $user = $request->user();
                $isSaved = Save::where('user_id', $user->id)->where('post_id', $postId)->exists();
                return response()->json(['saved' => $isSaved]);
            } catch (\Exception $e) {
                $retry++;
                if ($retry >= 3) {
                    return response()->json(['saved' => null, 'error' => 'Server error'], 500);
                }
                usleep(200000); // 200ms
            }
        }
    }
}
