<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Follow;
use App\Models\Post;
use App\Models\Comment;
use App\Models\Notification;
use App\Models\PostReact;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(50)->create();

        Follow::factory(10)->existing()->create();
        Post::factory(10)->existing()->create();
        Comment::factory(10)->existing()->create();
        PostReact::factory(10)->existing()->create();
        Notification::factory(10)->existing()->create();
    }
}
