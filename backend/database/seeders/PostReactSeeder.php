<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use App\Models\PostReact;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class PostReactSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $posts = Post::all();
        $faker = Faker::create();

        if ($users->isEmpty() || $posts->isEmpty()) {
            $this->command->info('No users or posts found, skipping post react seeding.');
            return;
        }

        $reactTypes = ['like', 'love', 'haha', 'wow', 'sad', 'angry']; // Define available react types

        // Create reactions for a random subset of user-post combinations
        $numberOfReactions = $faker->numberBetween(500, 2000); // Create between 500 and 2000 reactions

        for ($i = 0; $i < $numberOfReactions; $i++) {
            $user = $users->random();
            $post = $posts->random();
            $reactType = $faker->randomElement($reactTypes);

            // Check if this user has already reacted to this post with this type (or any type if you want unique reactions per post per user)
            // The schema doesn't have a unique constraint on (user_id, post_id, react_type), only (user_id, post_id) if added later.
            // For basic seeding, let's allow multiple reaction types from the same user on the same post for simplicity, but ensure the pair (user, post, type) is unique in this seed run.
            if (!PostReact::where('user_id', $user->id)->where('post_id', $post->id)->where('react_type', $reactType)->exists()) {
                PostReact::create([
                    'user_id' => $user->id,
                    'post_id' => $post->id,
                    'react_type' => $reactType,
                ]);

                // Update post react count (optional, can use observer)
                $post->increment('react_count');
            }
        }
    }
}
