<?php

namespace Database\Factories;

use App\Models\Follow;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class FollowFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Follow::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $followerId = User::inRandomOrder()->first()?->id ?? User::factory();
        $followedId = User::inRandomOrder()->where('id', '!=', $followerId)->first()?->id ?? User::factory();
        $createdAt = $this->faker->dateTimeBetween('-1 year', 'now'); // Post được tạo trong 1 năm trở lại đây
        $updatedAt = $this->faker->dateTimeBetween($createdAt, 'now'); // updated_at sau created_at
        return [
            'follower_id' => $followerId,
            'followed_id' => $followedId,
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
        return $this->afterCreating(function (Follow $follow) {
            // Ensure follower_id is not the same as followed_id
            if ($follow->follower_id === $follow->followed_id) {
                $anotherUser = User::where('id', '!=', $follow->follower_id)->inRandomOrder()->first();
                if ($anotherUser) {
                    $follow->followed_id = $anotherUser->id;
                    $follow->save();
                } else {
                    // Handle case with very few users if necessary
                }
            }
        });
    }
}
