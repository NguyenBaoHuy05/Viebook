<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    protected $model = Post::class;
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => $this->faker->sentence,
            'content' => $this->faker->sentence,
            'type_content' => $this->faker->randomElement(['music', 'blog', 'entertainment', 'news', 'tutorial', 'review', 'personal', null]),
            'react_count' => 0,
            'comment_count' => 0,
            'share_count' => 0,
            'created_at' => now(),
        ];
    }
    public function existing(): static
    {
        return $this->state(function (array $attributes) {
            $user = User::inRandomOrder()->first();

            return [
                'user_id' => $user->id,
            ];
        });
    }
    /**
     * Tạo một trạng thái với số lượng react ngẫu nhiên.
     *
     * @return $this
     */
    public function withReacts(int $count = 0): static
    {
        return $this->state(function (array $attributes) use ($count) {
            return [
                'react_count' => $count ?? $this->faker->numberBetween(0, 50),
            ];
        });
    }
    /**
     * Tạo một trạng thái với số lượng comment ngẫu nhiên.
     *
     * @return $this
     */
    public function withComments(int $count = 0): static
    {
        return $this->state(function (array $attributes) use ($count) {
            return [
                'comment_count' => $count ?? $this->faker->numberBetween(0, 30),
            ];
        });
    }
    /**
     * Tạo một trạng thái với số lượng share ngẫu nhiên.
     *
     * @return $this
     */
    public function withShares(int $count = 0): static
    {
        return $this->state(function (array $attributes) use ($count) {
            return [
                'share_count' => $count ?? $this->faker->numberBetween(0, 20),
            ];
        });
    }
    /**
     * Tạo một trạng thái cho bài viết loại music.
     *
     * @return $this
     */
    public function isMusic(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'type_content' => 'music',
            ];
        });
    }
    /**
     * Tạo một trạng thái cho bài viết loại blog.
     *
     * @return $this
     */
    public function isBlog(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'type_content' => 'blog',
            ];
        });
    }

    /**
     * Tạo một trạng thái cho bài viết loại entertainment.
     *
     * @return $this
     */
    public function isEntertainment(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'type_content' => 'entertainment',
            ];
        });
    }

    /**
     * Tạo một trạng thái cho bài viết loại news.
     *
     * @return $this
     */
    public function isNews(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'type_content' => 'news',
            ];
        });
    }
    /**
     * Tạo một trạng thái cho bài viết loại tutorial.
     *
     * @return $this
     */
    public function isTutorial(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'type_content' => 'tutorial',
            ];
        });
    }
    /**
     * Tạo một trạng thái cho bài viết loại review.
     *
     * @return $this
     */
    public function isReview(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'type_content' => 'review',
            ];
        });
    }
    /**
     * Tạo một trạng thái cho bài viết loại personal.
     *
     * @return $this
     */
    public function isPersonal(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'type_content' => 'personal',
            ];
        });
    }
}
