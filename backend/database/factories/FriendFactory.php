<?php

namespace Database\Factories;

use App\Models\Friend;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class FriendFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Friend::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // We need two different user IDs.
        $userId1 = User::inRandomOrder()->first()?->id ?? User::factory();
        $userId2 = User::inRandomOrder()->where('id', '!=', $userId1)->first()?->id ?? User::factory();

        // To respect the unique constraint (user_id, friend_id), always order the IDs.
        $userA = min($userId1, $userId2);
        $userB = max($userId1, $userId2);
        $createdAt = $this->faker->dateTimeBetween('-1 year', 'now'); // Post được tạo trong 1 năm trở lại đây
        $updatedAt = $this->faker->dateTimeBetween($createdAt, 'now'); // updated_at sau created_at
        return [
            'user_id' => $userA,
            'friend_id' => $userB,
            'status' => $this->faker->randomElement(['pending', 'accepted', 'blocked']),
            'created_at' => $createdAt, // Thêm created_at
            'updated_at' => $updatedAt, // Thêm updated_at
        ];
    }

    /**
     * Configure the model factory.
     */
    public function configure(): static
    {
        return $this->afterMaking(function (Friend $friend) {
            // Ensure user_id is different from friend_id
            if ($friend->user_id === $friend->friend_id) {
                $anotherUser = User::where('id', '!=', $friend->user_id)->inRandomOrder()->first();
                if ($anotherUser) {
                    $friend->friend_id = $anotherUser->id;
                } else {
                    // Handle case with very few users if necessary
                }
            }
            // Ensure user_id < friend_id for unique constraint (already done in definition, but good safeguard)
            if ($friend->user_id > $friend->friend_id) {
                [$friend->user_id, $friend->friend_id] = [$friend->friend_id, $friend->user_id];
            }
        });
    }

    /**
     * Indicate that the friendship is accepted.
     */
    public function accepted(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'accepted',
        ]);
    }

    /**
     * Indicate that the friendship is pending.
     */
    public function pending(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'pending',
        ]);
    }

    /**
     * Indicate that the friendship is blocked.
     */
    public function blocked(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'blocked',
        ]);
    }
}
