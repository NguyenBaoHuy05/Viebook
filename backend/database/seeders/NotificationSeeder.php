<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Follow;
use App\Models\Comment;
use App\Models\PostReact;
use App\Models\Notification;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Generate notifications for follows
        $follows = Follow::all();
        foreach ($follows as $follow) {
            // Notify the followed user that someone is following them
            Notification::create([
                'user_id' => $follow->followed_id, // The user receiving the notification
                'actor_id' => $follow->follower_id, // The user performing the action
                'type' => 'follow',
                'target_type' => User::class,
                'target_id' => $follow->follower_id, // The user who followed
                'is_read' => false,
            ]);
        }

        // Generate notifications for comments
        $comments = Comment::all();
        foreach ($comments as $comment) {
            // Get the post owner
            $postOwnerId = $comment->post->user_id;

            // Don't notify the post owner if they commented on their own post
            if ($comment->user_id !== $postOwnerId) {
                Notification::create([
                    'user_id' => $postOwnerId, // The post owner receives the notification
                    'actor_id' => $comment->user_id, // The user who commented
                    'type' => 'comment',
                    'target_type' => Comment::class,
                    'target_id' => $comment->id, // The comment itself
                    'is_read' => false,
                ]);
            }

            // Optional: Notify the parent comment owner if it's a reply
            if ($comment->parent_comment_id) {
                $parentComment = $comment->parentComment; // Assuming you have this relationship defined in your Comment model
                if ($parentComment && $comment->user_id !== $parentComment->user_id) { // Don't notify if replying to self
                    Notification::create([
                        'user_id' => $parentComment->user_id, // The parent comment owner receives the notification
                        'actor_id' => $comment->user_id, // The user who replied
                        'type' => 'reply_comment', // Or a different type if you prefer
                        'target_type' => Comment::class,
                        'target_id' => $comment->id, // The reply comment
                        'is_read' => false,
                    ]);
                }
            }
        }

        // Generate notifications for post reacts
        $postReacts = PostReact::all();
        foreach ($postReacts as $react) {
            // Get the post owner
            $postOwnerId = $react->post->user_id;

            // Don't notify the post owner if they reacted to their own post
            if ($react->user_id !== $postOwnerId) {
                Notification::create([
                    'user_id' => $postOwnerId,
                    'actor_id' => $react->user_id,
                    'type' => 'react',
                    'target_type' => PostReact::class,
                    'target_id' => $react->id,
                    'is_read' => false,
                ]);
            }
        }

        // Optional: Add notifications for shared posts (notify original post owner)
        $sharedPosts = \App\Models\Post::whereNotNull('share_post_id')->get();
        foreach ($sharedPosts as $sharedPost) {
            $originalPost = $sharedPost->sharedPost; // Assuming you have this relationship
            if ($originalPost && $sharedPost->user_id !== $originalPost->user_id) {
                Notification::create([
                    'user_id' => $originalPost->user_id,
                    'actor_id' => $sharedPost->user_id,
                    'type' => 'share',
                    'target_type' => \App\Models\Post::class,
                    'target_id' => $sharedPost->id,
                    'is_read' => false,
                ]);
            }
        }
    }
}
