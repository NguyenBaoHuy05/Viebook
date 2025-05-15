<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $faker = Faker::create();

        if ($users->isEmpty()) {
            $this->command->info('No users found, skipping post seeding.');
            return;
        }

        foreach ($users as $user) {
            // Create 10-20 posts for each user
            $numberOfPosts = $faker->numberBetween(10, 20);
            for ($i = 0; $i < $numberOfPosts; $i++) {
                Post::factory()->create([
                    'user_id' => $user->id,
                    'title' => $faker->sentence(),
                    'content' => $faker->paragraph(rand(3, 8)),
                    'privacy' => $faker->randomElement(['public', 'private', 'friends']),
                    'type_content' => $faker->randomElement(['text', 'image', 'video', null]),
                    // share_post_id will be null by default or can be set later
                ]);
            }
        }

        // Optional: Create some shared posts
        $posts = Post::all();
        if ($posts->count() > 10) { // Ensure there are enough posts to share
            $users = User::all();
            foreach ($users as $user) {
                // Share a few random posts
                $postsToShare = $posts->random(rand(0, min(5, $posts->count()))); // Share between 0 and 5 posts
                foreach ($postsToShare as $postToShare) {
                    // Ensure the user doesn't share their own post
                    if ($user->id !== $postToShare->user_id) {
                        Post::factory()->create([
                            'user_id' => $user->id,
                            'share_post_id' => $postToShare->id,
                            'title' => 'Shared: ' . $postToShare->title, // Add context
                            'content' => $faker->sentence(rand(5, 15)), // Optional comment on the share
                            'privacy' => $faker->randomElement(['public', 'private', 'friends']),
                            'type_content' => null, // Shared posts often don't have their own type_content like the original
                        ]);
                        // Update original post's share count (optional, use observer for production)
                        $postToShare->increment('share_count');
                    }
                }
            }
        }
    }
}
