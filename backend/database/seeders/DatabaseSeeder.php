<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Order matters for foreign key constraints
        $this->call([
            UserSeeder::class,
            FollowSeeder::class, // Depends on Users
            FriendSeeder::class, // Depends on Users
            PostSeeder::class,   // Depends on Users
            CommentSeeder::class, // Depends on Users, Posts, Comments (for parent)
            PostReactSeeder::class, // Depends on Users, Posts
            ConversationSeeder::class, // Depends on Users
            MessageSeeder::class, // Depends on Users, Conversations
            NotificationSeeder::class, // Depends on Users, Follows, Comments, PostReacts, Posts
            // PasswordResetTokens, Cache, Sessions, PersonalAccessTokens, Jobs are typically not seeded like this
        ]);
    }
}
