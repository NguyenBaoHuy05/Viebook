<?php

namespace Database\Factories;

use App\Models\Comment;
use App\Models\User;
use App\Models\Post;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Comment::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $userId = User::inRandomOrder()->first()?->id ?? User::factory();
        $postId = Post::inRandomOrder()->first()?->id ?? Post::factory();
        $createdAt = $this->faker->dateTimeBetween('-1 year', 'now'); // Post được tạo trong 1 năm trở lại đây
        $updatedAt = $this->faker->dateTimeBetween($createdAt, 'now'); // updated_at sau created_at
        // Factory alone can't easily create nested comments correctly.
        // This factory creates basic comments. Seeder handles parent/top_level logic.
        return [
            'user_id' => $userId,
            'post_id' => $postId,
            'content' => $this->faker->paragraph(rand(1, 3)),
            'parent_comment_id' => null, // Handled in seeder
            'top_level_comment_id' => null, // Handled in seeder
            'created_at' => $createdAt, // Thêm created_at
            'updated_at' => $updatedAt, // Thêm updated_at
            // timestamps are handled automatically by model
        ];
    }
}
