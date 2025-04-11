<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use  App\Models\Post;
use App\Models\Comment;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Comment>
 */
class CommentFactory extends Factory
{
    protected $model = Comment::class;
    public function definition(): array
    {
        return [
            'user_id' => User::factory(), // Tạo một user ngẫu nhiên cho mỗi bình luận
            'post_id' => Post::factory(), // Tạo một post ngẫu nhiên cho mỗi bình luận
            'content' => $this->faker->sentence(),
            'created_at' => now(),
            'parent_comment_id' => null,
        ];
    }
    // Trạng thái: Dùng user và post hiện có
    public function existing(): static
    {
        return $this->state(function (array $attributes) {
            $user = User::inRandomOrder()->first() ?? User::factory()->create();
            $post = Post::inRandomOrder()->first() ?? Post::factory()->create();

            return [
                'user_id' => $user->id,
                'post_id' => $post->id,
            ];
        });
    }
    // Trạng thái: Comment là reply (có parent_comment_id)
    public function reply(): static
    {
        return $this->state(function (array $attributes) {
            $parentComment = Comment::inRandomOrder()->first() ?? Comment::factory()->create();

            return [
                'parent_comment_id' => $parentComment->id,
            ];
        });
    }
}
