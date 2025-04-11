<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'email_verified_at' => $this->faker->optional()->dateTime(),
            'password' => bcrypt('password123'),
            'profile_picture' => $this->faker->optional()->imageUrl(200, 200, 'people'),
            'bio' => $this->faker->optional(0.7)->paragraph(),
            'location' => $this->faker->optional(0.7)->city(),
            'count_follow' => $this->faker->numberBetween(0, 100),
            'remember_token' => Str::random(10),
            'created_at' => now(),
        ];
    }
    // Trạng thái tùy chỉnh: User đã xác minh email
    public function verified(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'email_verified_at' => now(),
            ];
        });
    }

    // Trạng thái tùy chỉnh: User chưa xác minh email
    public function unverified(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'email_verified_at' => null,
            ];
        });
    }
}
