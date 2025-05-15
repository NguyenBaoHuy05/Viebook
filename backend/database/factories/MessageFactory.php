<?php

namespace Database\Factories;

use App\Models\Message;
use App\Models\User;
use App\Models\Conversation;
use Illuminate\Database\Eloquent\Factories\Factory;

class MessageFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Message::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // We need a user and a conversation.
        // Ideally, the user should be a participant in the conversation.
        // This factory might create users/conversations that aren't linked
        // if the database is empty. The Seeder is better for ensuring valid relationships.

        $userId = User::inRandomOrder()->first()?->id ?? User::factory();
        $conversationId = Conversation::inRandomOrder()->first()?->id ?? Conversation::factory();
        $createdAt = $this->faker->dateTimeBetween('-1 year', 'now'); // Post được tạo trong 1 năm trở lại đây
        $updatedAt = $this->faker->dateTimeBetween($createdAt, 'now'); // updated_at sau created_at
        return [
            'user_id' => $userId, // User who sent the message
            'conversation_id' => $conversationId,
            'content' => $this->faker->sentence(rand(5, 20)),
            'is_read' => $this->faker->boolean(70), // 70% chance of being read
            'is_deleted' => $this->faker->boolean(5),
            'is_edited' => $this->faker->boolean(10),
            'is_starred' => $this->faker->boolean(15),
            'is_pinned' => $this->faker->boolean(5),
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => now(),
        ];
    }

    /**
     * Configure the model factory.
     */
    public function configure(): static
    {
        return $this->afterMaking(function (Message $message) {
            // Optional: Ensure the user is part of the conversation
            // Requires relationships on Message and Conversation models
            // $conversation = $message->conversation;
            // if ($conversation && !$conversation->users->contains($message->user_id)) { ... }
        });
    }
}
