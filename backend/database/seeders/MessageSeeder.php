<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class MessageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $conversations = Conversation::all();
        $faker = Faker::create();

        if ($conversations->isEmpty()) {
            $this->command->info('No conversations found, skipping message seeding.');
            return;
        }

        foreach ($conversations as $conversation) {
            $participants = $conversation->users; // Get users in this conversation

            if ($participants->isEmpty()) {
                $this->command->info("Conversation ID {$conversation->id} has no participants, skipping message seeding.");
                continue;
            }

            // Create 10-50 messages per conversation
            $numberOfMessages = $faker->numberBetween(10, 50);

            for ($i = 0; $i < $numberOfMessages; $i++) {
                $sender = $participants->random(); // Message sent by a random participant

                Message::create([
                    'user_id' => $sender->id,
                    'conversation_id' => $conversation->id,
                    'content' => $faker->sentence(rand(5, 20)),
                    'is_read' => $faker->boolean(70), // 70% chance of being read
                    'is_deleted' => $faker->boolean(5), // 5% chance of being deleted
                    'is_edited' => $faker->boolean(10), // 10% chance of being edited
                    'is_starred' => $faker->boolean(15), // 15% chance of being starred
                    'is_pinned' => $faker->boolean(5), // 5% chance of being pinned
                    'created_at' => $faker->dateTimeBetween('-1 year', 'now'), // Random date within the last year
                    'updated_at' => now(), // Or a date after created_at if edited
                ]);
            }
        }
    }
}
