<?php

namespace Database\Factories;

use App\Models\Conversation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ConversationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Conversation::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $creatorId = User::inRandomOrder()->first()?->id ?? User::factory();
        $type = $this->faker->randomElement(['group', 'private']);
        $createdAt = $this->faker->dateTimeBetween('-1 year', 'now'); // Post được tạo trong 1 năm trở lại đây
        $updatedAt = $this->faker->dateTimeBetween($createdAt, 'now'); // updated_at sau created_at
        return [
            'name' => ($type === 'group') ? $this->faker->words(rand(2, 4), true) . ' Group' : null,
            'type' => $type,
            'creator_id' => $creatorId,
            'created_at' => $createdAt, // Thêm created_at
            'updated_at' => $updatedAt, // Thêm updated_at
            // timestamps are handled automatically by model
        ];
    }

    /**
     * Indicate that the conversation is private.
     */
    public function private(): static
    {
        return $this->state(fn(array $attributes) => [
            'name' => null,
            'type' => 'private',
        ]);
    }

    /**
     * Indicate that the conversation is a group.
     */
    public function group(): static
    {
        return $this->state(fn(array $attributes) => [
            'name' => $this->faker->words(rand(2, 4), true) . ' Group',
            'type' => 'group',
        ]);
    }
}
