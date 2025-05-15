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
            // Create 5-15 top-level comments for each post
            $numberOfComments = $faker->numberBetween(5, 15);
            $topLevelComments = [];

            for ($i = 0; $i < $numberOfComments; $i++) {
                $user = $users->random(); // Random user comments

                $comment = Comment::create([
                    'user_id' => $user->id,
                    'post_id' => $post->id,
                    'content' => $faker->paragraph(rand(1, 3)),
                    'parent_comment_id' => null,
                    'top_level_comment_id' => null,
                ]);
                $topLevelComments[] = $comment;

                // Update post comment count (optional, can use observer)
                $post->increment('comment_count');
            }

            // Create some replies to the top-level comments
            if (!empty($topLevelComments) && count($topLevelComments) > 3) {
                foreach ($topLevelComments as $topComment) {
                    // Create 0-3 replies for each top-level comment
                    $numberOfReplies = $faker->numberBetween(0, 3);
                    for ($i = 0; $i < $numberOfReplies; $i++) {
                        $user = $users->random(); // Random user replies

                        // --- Bắt đầu đoạn code lỗi và đã sửa ---
                        if ($user->id === $topComment->user_id) {
                            // Nếu người dùng được chọn ngẫu nhiên trùng với người tạo comment cha,
                            // thử chọn một người dùng khác.
                            $otherUsers = $users->except($topComment->user_id);

                            // Kiểm tra xem còn người dùng nào khác không
                            if ($otherUsers->isEmpty()) {
                                continue; // Không còn người dùng khác, bỏ qua reply này
                            }
                            $user = $otherUsers->random(); // Chọn ngẫu nhiên từ những người dùng còn lại
                        }
                        // --- Kết thúc đoạn code lỗi và đã sửa ---


                        $reply = Comment::create([
                            'user_id' => $user->id,
                            'post_id' => $post->id, // Replies belong to the same post
                            'content' => $faker->sentence(rand(5, 10)),
                            'parent_comment_id' => $topComment->id,
                            'top_level_comment_id' => $topComment->id,
                        ]);

                        // Update post comment count (optional)
                        $post->increment('comment_count');

                        // Create nested replies (optional, for a deeper structure)
                        if ($faker->boolean(30)) { // 30% chance of having nested replies
                            $numberOfNestedReplies = $faker->numberBetween(0, 2);
                            for ($j = 0; $j < $numberOfNestedReplies; $j++) {
                                $nestedUser = $users->random();

                                // Tương tự, kiểm tra người dùng lồng nhau
                                if ($nestedUser->id === $reply->user_id) {
                                    $otherUsersNested = $users->except($reply->user_id);
                                    if ($otherUsersNested->isEmpty()) {
                                        continue;
                                    }
                                    $nestedUser = $otherUsersNested->random();
                                }

                                Comment::create([
                                    'user_id' => $nestedUser->id,
                                    'post_id' => $post->id,
                                    'content' => $faker->sentence(rand(3, 7)),
                                    'parent_comment_id' => $reply->id,
                                    'top_level_comment_id' => $topComment->id, // Still points to the top-level
                                ]);
                                // Update post comment count (optional)
                                $post->increment('comment_count');
                            }
                        }
                    }
                }
            }
        }
    }
}
