<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class CommentSeeder extends Seeder
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
            $this->command->info('No users or posts found, skipping comment seeding.');
            return;
        }

        foreach ($posts as $post) {
            $numberOfComments = $faker->numberBetween(2, 5);
            $topLevelComments = [];

            for ($i = 0; $i < $numberOfComments; $i++) {
                $user = $users->random();

                // --- SỬ DỤNG FACTORY ĐỂ TẠO TOP-LEVEL COMMENT ---
                $comment = Comment::factory()->create([
                    'user_id' => $user->id,
                    'post_id' => $post->id,
                    'content' => $faker->paragraph(rand(1, 3)),
                    // parent_comment_id và top_level_comment_id mặc định là null trong factory, không cần ghi đè
                ]);
                // --- KẾT THÚC SỬ DỤNG FACTORY ---

                $topLevelComments[] = $comment;

                $post->increment('comment_count');
            }

            if (!empty($topLevelComments) && count($topLevelComments) > 3) {
                foreach ($topLevelComments as $topComment) {
                    $numberOfReplies = $faker->numberBetween(0, 3);
                    for ($i = 0; $i < $numberOfReplies; $i++) {
                        $user = $users->random();

                        if ($user->id === $topComment->user_id) {
                            $otherUsers = $users->except($topComment->user_id);
                            if ($otherUsers->isEmpty()) {
                                continue;
                            }
                            $user = $otherUsers->random();
                        }

                        // --- SỬ DỤNG FACTORY ĐỂ TẠO REPLY ---
                        $reply = Comment::factory()->create([
                            'user_id' => $user->id,
                            'post_id' => $post->id,
                            'content' => $faker->sentence(rand(5, 10)),
                            'parent_comment_id' => $topComment->id,
                            'top_level_comment_id' => $topComment->id,
                        ]);
                        // --- KẾT THÚC SỬ DỤNG FACTORY ---

                        $post->increment('comment_count');

                        if ($faker->boolean(30)) {
                            $numberOfNestedReplies = $faker->numberBetween(0, 2);
                            for ($j = 0; $j < $numberOfNestedReplies; $j++) {
                                $nestedUser = $users->random();

                                if ($nestedUser->id === $reply->user_id) {
                                    $otherUsersNested = $users->except($reply->user_id);
                                    if ($otherUsersNested->isEmpty()) {
                                        continue;
                                    }
                                    $nestedUser = $otherUsersNested->random();
                                }

                                // --- SỬ DỤNG FACTORY ĐỂ TẠO NESTED REPLY ---
                                Comment::factory()->create([
                                    'user_id' => $nestedUser->id,
                                    'post_id' => $post->id,
                                    'content' => $faker->sentence(rand(3, 7)),
                                    'parent_comment_id' => $reply->id,
                                    'top_level_comment_id' => $topComment->id,
                                ]);
                                // --- KẾT THÚC SỬ DỤNG FACTORY ---

                                $post->increment('comment_count');
                            }
                        }
                    }
                }
            }
        }
    }
}
