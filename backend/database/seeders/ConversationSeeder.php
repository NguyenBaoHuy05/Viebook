<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Conversation;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class ConversationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $faker = Faker::create();

        if ($users->count() < 2) {
            $this->command->info('Not enough users to create conversations.');
            return;
        }

        // Create some private conversations (between 2 users)
        $numberOfPrivateConversations = $faker->numberBetween(20, 50);
        for ($i = 0; $i < $numberOfPrivateConversations; $i++) {
            $participants = $users->random(2); // Get 2 random users
            $user1 = $participants->first();
            $user2 = $participants->last();

            // Check if a private conversation between these two users already exists
            // This is a bit complex to check efficiently, for seeding we can just create and handle potential duplicates if a unique constraint exists (though the schema doesn't show one for private convos specifically).
            // A simple check could be to see if a conversation of type 'private' has exactly these two users.
            // For seeding simplicity, we'll just create them. If duplicates are an issue, add a unique constraint or more complex check.

            $conversation = Conversation::create([
                'name' => null, // Private conversations often don't have a name
                'type' => 'private',
                'creator_id' => $user1->id, // One of the participants
            ]);

            // Attach users to the conversation
            $conversation->users()->attach([$user1->id, $user2->id]);
        }

        // Create some group conversations (3+ users)
        $numberOfGroupConversations = $faker->numberBetween(5, 15);
        for ($i = 0; $i < $numberOfGroupConversations; $i++) {
            // Ensure there are enough users for a group
            if ($users->count() < 3) break;

            $creator = $users->random();
            // Get 2 to 5 other random users (plus the creator makes 3 to 6 total)
            $participants = $users->except($creator->id)->random(rand(2, min(5, $users->count() - 1)));
            $participantIds = $participants->pluck('id')->toArray();
            $participantIds[] = $creator->id; // Add the creator to the participants

            $conversation = Conversation::create([
                'name' => $faker->words(rand(2, 4), true) . ' Group', // Generate a group name
                'type' => 'group',
                'creator_id' => $creator->id,
            ]);

            // Attach users to the conversation
            $conversation->users()->attach($participantIds);
        }
    }
}
