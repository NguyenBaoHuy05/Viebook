<?php

namespace Database\Factories;

use App\Models\PostReact;
use App\Models\User;
use App\Models\Post;
use Illuminate\Database\Eloquent\Factories\Factory;

class PostReactFactory extends Factory
{
    protected $model = PostReact::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'post_id' => Post::factory(),
            'created_at' => now(),
            'react_type' => $this->faker->randomElement(['like', 'love', 'haha', 'wow', 'sad', 'angry']),
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

    // Trạng thái: Reaction cụ thể
    public function like(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'react_type' => 'like',
            ];
        });
    }
}
