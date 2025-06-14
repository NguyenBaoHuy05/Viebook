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
            // Tạo 10-20 bài Post
            $numberOfPosts = $faker->numberBetween(10, 20);
            for ($i = 0; $i < $numberOfPosts; $i++) {
                Post::factory()->create([
                    'user_id' => $user->id,
                    'title' => $faker->sentence(),
                    'privacy' => $faker->randomElement(['public', 'private', 'friends']),
                    'type_content' => $faker->randomElement(['text', 'image', 'video', null]),
                ]);
            }
        }

        $posts = Post::all();
        if ($posts->count() > 10) {
            $users = User::all();
            foreach ($users as $user) {
                $postsToShare = $posts->random(rand(0, min(5, $posts->count()))); // Share between 0 and 5 posts
                foreach ($postsToShare as $postToShare) {
                    if ($user->id !== $postToShare->user_id) {
                        Post::factory()->create([
                            'user_id' => $user->id,
                            'share_post_id' => $postToShare->id,
                            'title' => 'Shared: ' . $postToShare->title,
                            'privacy' => $faker->randomElement(['public', 'private', 'friends']),
                            'type_content' => null,
                        ]);
                        $postToShare->increment('share_count');
                    }
                }
            }
        }
    }
}
