<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Follow;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class FollowSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $faker = Faker::create();

        if ($users->count() < 2) {
            $this->command->info('Not enough users to create follow relationships.');
            return;
        }

        foreach ($users as $follower) {
            // Get a random subset of other users to follow
            $usersToFollow = $users->except($follower->id)->random(rand(0, min(10, $users->count() - 1))); // Follow 0 to 10 users

            foreach ($usersToFollow as $followed) {
                // Check if the follow relationship already exists
                if (!Follow::where('follower_id', $follower->id)->where('followed_id', $followed->id)->exists()) {
                    Follow::create([
                        'follower_id' => $follower->id,
                        'followed_id' => $followed->id,
                    ]);

                    // Update user follow counts (optional, can use observer)
                    $follower->increment('count_follow');
                    $followed->increment('count_follower');
                }
            }
        }
    }
}
