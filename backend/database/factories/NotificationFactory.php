<?php

namespace Database\Factories;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class NotificationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Notification::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $userId = User::inRandomOrder()->first()?->id ?? User::factory();
        $actorId = User::inRandomOrder()->where('id', '!=', $userId)->first()?->id ?? User::factory();
        $createdAt = $this->faker->dateTimeBetween('-1 year', 'now'); // Post được tạo trong 1 năm trở lại đây
        $updatedAt = $this->faker->dateTimeBetween($createdAt, 'now'); // updated_at sau created_at
        // Defining target_type and target_id in a factory is tricky because they can be polymorphic.
        // It's often better to set these specifically in the Seeder based on the actual created models (like Follow, Comment, PostReact).
        // This factory provides basic notification data without a meaningful target relationship.
        return [
            'user_id' => $userId,
            'actor_id' => $actorId,
            'type' => $this->faker->randomElement(['follow', 'comment', 'react', 'share', 'friend_request']), // Example types
            'target_type' => null, // Should be set specifically in seeder
            'target_id' => null, // Should be set specifically in seeder
            'is_read' => $this->faker->boolean(50), // 50% chance of being read
            'created_at' => $createdAt, // Thêm created_at
            'updated_at' => $updatedAt, // Thêm updated_at
        ];
    }
}
