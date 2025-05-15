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

        $reactTypes = ['like', 'love', 'haha', 'wow', 'sad', 'angry'];

        $numberOfReactions = $faker->numberBetween(500, 2000);

        for ($i = 0; $i < $numberOfReactions; $i++) {
            $user = $users->random();
            $post = $posts->random();
            $reactType = $faker->randomElement($reactTypes);

            // Check if this user has already reacted to this post with this type
            if (!PostReact::where('user_id', $user->id)->where('post_id', $post->id)->where('react_type', $reactType)->exists()) {

                // --- SỬ DỤNG FACTORY ĐỂ TẠO POST REACT ---
                PostReact::factory()->create([
                    'user_id' => $user->id,
                    'post_id' => $post->id,
                    'react_type' => $reactType,
                ]);
                // --- KẾT THÚC SỬ DỤNG FACTORY ---

                $post->increment('react_count');
            }
        }
    }
}
