<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $faker = $this->faker;

        $email = $faker->unique()->safeEmail();
        while (str_ends_with($email, '@example.com')) {
            $email = $faker->unique()->safeEmail();
        }

        $username = $faker->unique()->userName();

        $createdAt = $faker->dateTimeBetween('-5 years', '-1 year');
        $updatedAt = $faker->dateTimeBetween($createdAt, 'now');

        return [
            'username' => $username,
            'name' => $faker->name(),
            'email' => $email,
            'email_verified_at' => $faker->boolean(80) ? $faker->dateTimeBetween($createdAt, $updatedAt) : null, // verified_at giữa created và updated
            'password' => Hash::make('A123123@'),
            'remember_token' => Str::random(10),
            'profile_picture' => null,
            'bio' => $faker->sentence(),
            'location' => $faker->city(),
            'count_follow' => 0,
            'count_follower' => 0,
            'count_friend' => 0,
            'role' => 'user', // Mặc định là user, sẽ bị ghi đè trong Seeder cho admin
            'block' => false, // Mặc định là false, sẽ bị ghi đè trong Seeder
            'created_at' => $createdAt,
            'updated_at' => $updatedAt,
        ];
    }
}
