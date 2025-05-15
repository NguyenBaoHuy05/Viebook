<?php

namespace Database\Factories;

use App\Models\PostReact;
use App\Models\User;
use App\Models\Post;
use Illuminate\Database\Eloquent\Factories\Factory;

class PostReactFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = PostReact::class;

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
        $reactTypes = ['like', 'love', 'haha', 'wow', 'sad', 'angry'];

        return [
            'user_id' => $userId,
            'post_id' => $postId,
            'react_type' => $this->faker->randomElement($reactTypes),
            'created_at' => $createdAt, // Thêm created_at
            'updated_at' => $updatedAt, // Thêm updated_at
            // timestamps are handled automatically by model
        ];
    }

    /**
     * Configure the model factory.
     */
    public function configure(): static
    {
        return $this->afterMaking(function (PostReact $react) {
            // Prevent user reacting to their own post in factory creation, if desired
            // Requires Post relationship on PostReact model
            // if ($react->user_id === $react->post->user_id) { ... }
        })->afterCreating(function (PostReact $react) {
            // Ensure unique (user_id, post_id, react_type) if needed, or handle in seeder
            // The schema doesn't strictly require unique reactions per type per post per user,
            // but a common pattern is one reaction per user per post (any type).
            // If you want unique (user_id, post_id), add a unique constraint to the table.
        });
    }
}
