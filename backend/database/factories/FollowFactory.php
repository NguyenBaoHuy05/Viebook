<?php

namespace Database\Factories;

use App\Models\Follow;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class FollowFactory extends Factory
{
    protected $model = Follow::class;

    public function definition()
    {
        return [
            'follower_id' => User::factory(), // Tạo user mới làm follower
            'followee_id' => User::factory(), // Tạo user mới làm followee
            'created_at' => now(), // Thời điểm hiện tại
        ];
    }

    // Trạng thái: Dùng user hiện có
    public function existing(): static
    {
        return $this->state(function (array $attributes) {
            $follower = User::inRandomOrder()->first() ?? User::factory()->create();
            $followee = User::inRandomOrder()->where('id', '!=', $follower->id)->first() ?? User::factory()->create();

            return [
                'follower_id' => $follower->id,
                'followee_id' => $followee->id,
            ];
        });
    }
}
