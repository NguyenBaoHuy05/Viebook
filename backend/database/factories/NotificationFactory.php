<?php

namespace Database\Factories;

use App\Models\Notification;
use App\Models\User;
use App\Models\Post;
use App\Models\Comment;
use Illuminate\Database\Eloquent\Factories\Factory;

class NotificationFactory extends Factory
{
    protected $model = Notification::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'actor_id' => User::factory(),
            'type' => $this->faker->randomElement(['like', 'comment', 'follow', 'mention']),
            'target_id' => $this->faker->optional(0.8)->randomNumber(),
            'isRead' => $this->faker->boolean(20),
            'created_at' => now(),
        ];
    }

    // Trạng thái: Dùng user hiện có
    public function existing(): static
    {
        return $this->state(function (array $attributes) {
            $user = User::inRandomOrder()->first() ?? User::factory()->create();
            $actor = User::inRandomOrder()->where('id', '!=', $user->id)->first() ?? User::factory()->create();

            return [
                'user_id' => $user->id,
                'actor_id' => $actor->id,
            ];
        });
    }

    // Trạng thái: Thông báo đã đọc
    public function read(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'isRead' => true,
            ];
        });
    }

    // Trạng thái: Thông báo liên quan đến post
    public function postRelated(): static
    {
        return $this->state(function (array $attributes) {
            $post = Post::inRandomOrder()->first() ?? Post::factory()->create();

            return [
                'type' => $this->faker->randomElement(['like', 'comment']),
                'target_id' => $post->id,
            ];
        });
    }

    // Trạng thái: Thông báo liên quan đến comment
    public function commentRelated(): static
    {
        return $this->state(function (array $attributes) {
            $comment = Comment::inRandomOrder()->first() ?? Comment::factory()->create();

            return [
                'type' => 'comment',
                'target_id' => $comment->id,
            ];
        });
    }
}
