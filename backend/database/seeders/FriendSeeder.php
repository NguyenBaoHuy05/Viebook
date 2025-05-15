<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Friend;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class FriendSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $faker = Faker::create();

        if ($users->count() < 2) {
            $this->command->info('Not enough users to create friendships.');
            return;
        }

        // Create friendships - iterate through users and create relationships with users with higher IDs
        // to avoid duplicates and respect the unique constraint (user_id, friend_id) assuming user_id < friend_id
        $userIds = $users->pluck('id')->toArray();

        foreach ($userIds as $userId1) {
            // Get a random subset of users with a higher ID to potentially be friends with
            $possibleFriends = array_filter($userIds, fn($id) => $id > $userId1);
            if (empty($possibleFriends)) {
                continue;
            }

            $friendsToAttempt = $faker->randomElements($possibleFriends, rand(0, min(15, count($possibleFriends)))); // Attempt 0 to 15 friendships

            foreach ($friendsToAttempt as $userId2) {
                $status = $faker->randomElement(['accepted', 'accepted', 'accepted', 'pending', 'blocked']); // More accepted friendships

                // Ensure the relationship doesn't already exist in either direction (though the unique constraint on ordered IDs helps)
                if (!Friend::where(function ($query) use ($userId1, $userId2) {
                    $query->where('user_id', $userId1)->where('friend_id', $userId2);
                })->orWhere(function ($query) use ($userId1, $userId2) {
                    $query->where('user_id', $userId2)->where('friend_id', $userId1);
                })->exists()) {

                    // To respect the unique constraint (user_id, friend_id), always store with the smaller ID first.
                    $user1 = min($userId1, $userId2);
                    $user2 = max($userId1, $userId2);

                    Friend::create([
                        'user_id' => $user1,
                        'friend_id' => $user2,
                        'status' => $status,
                    ]);

                    // Update friend counts only for accepted friendships (optional, use observer for production)
                    if ($status === 'accepted') {
                        User::find($userId1)->increment('count_friend');
                        User::find($userId2)->increment('count_friend');
                    }
                    // You might update other counts for pending/blocked depending on your logic
                }
            }
        }
    }
}
