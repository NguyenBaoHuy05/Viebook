<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        // --- TẠO DUY NHẤT 1 ADMIN USER ---
        User::factory()->create([
            'username' => 'admin',
            'name' => 'Admin User',
            'email' => 'admin@yourdomain.com', // Đổi domain để không vi phạm validation
            'password' => Hash::make('A123123@'), // Mật khẩu cố định
            'email_verified_at' => now(),
            'role' => 'admin', // Đặt role là admin
            'block' => false,
            // timestamps sẽ được xử lý bởi factory definition
        ]);

        // --- TẠO TEST USER THƯỜNG ---
        User::factory()->create([
            'username' => 'testuser',
            'name' => 'Test User',
            'email' => 'test@yourdomain.com', // Đổi domain
            'password' => Hash::make('A123123@'), // Mật khẩu cố định
            'email_verified_at' => now(),
            'role' => 'user', // Đặt role là user
            'block' => false,
            // timestamps sẽ được xử lý bởi factory definition
        ]);


        // --- TẠO CÁC NGƯỜI DÙNG GIẢ CÒN LẠI VỚI ROLE 'user' ---
        // Chúng ta sẽ ghi đè role trong khi gọi factory
        User::factory()->count(50)->create(['role' => 'user'])->each(function ($user) use ($faker) {
            // role đã được đặt, chỉ cần set block status ngẫu nhiên
            $user->block = $faker->boolean(10); // 10% chance of being blocked
            $user->save(); // Cần save để cập nhật trường block
        });
    }
}
