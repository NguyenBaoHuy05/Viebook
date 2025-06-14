<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PostFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Post::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Get a random user ID, or create a new user if none exist (less common in seeding)
        $userId = User::inRandomOrder()->first()?->id ?? User::factory();

        // Get a random post ID for sharing, or null
        $sharePostId = $this->faker->boolean(1) ? Post::inRandomOrder()->first()?->id : null; // 20% chance of being a shared post
        $createdAt = $this->faker->dateTimeBetween('-1 year', 'now'); // Post được tạo trong 1 năm trở lại đây
        $updatedAt = $this->faker->dateTimeBetween($createdAt, 'now'); // updated_at sau created_at
        return [
            'user_id' => $userId,
            'share_post_id' => $sharePostId,
            'privacy' => $this->faker->randomElement(['public', 'private', 'friends', null]), // Allow null as per schema
            'title' => $this->faker->sentence(),
            'content' => "",
            'type_content' => $this->faker->randomElement(['text', 'image', 'video', null]),
            'react_count' => 0,
            'comment_count' => 0,
            'share_count' => 0,
            'created_at' => $createdAt, // Thêm created_at
            'updated_at' => $updatedAt, // Thêm updated_at
        ];
    }
}
