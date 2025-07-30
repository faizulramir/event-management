<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Event::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = $this->faker->dateTimeBetween('now', '+6 months');
        $endDate = $this->faker->dateTimeBetween($startDate, $startDate->format('Y-m-d H:i:s') . ' +1 week');

        return [
            'uuid' => Str::uuid(),
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->optional(0.8)->paragraphs(3, true),
            'start_date' => $startDate,
            'end_date' => $endDate,
            'location' => $this->faker->optional(0.7)->address(),
            'max_attendees' => $this->faker->optional(0.6)->numberBetween(10, 500),
            'is_public' => $this->faker->boolean(70), // 70% chance of being public
            'status' => $this->faker->randomElement(['draft', 'active', 'cancelled', 'completed']),
            'user_id' => User::factory(),
        ];
    }

    /**
     * Indicate that the event is public.
     */
    public function public(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_public' => true,
        ]);
    }

    /**
     * Indicate that the event is private.
     */
    public function private(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_public' => false,
        ]);
    }

    /**
     * Indicate that the event is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
        ]);
    }

    /**
     * Indicate that the event is upcoming.
     */
    public function upcoming(): static
    {
        $startDate = $this->faker->dateTimeBetween('+1 day', '+6 months');
        $endDate = $this->faker->dateTimeBetween($startDate, $startDate->format('Y-m-d H:i:s') . ' +1 week');

        return $this->state(fn (array $attributes) => [
            'start_date' => $startDate,
            'end_date' => $endDate,
            'status' => 'active',
        ]);
    }

    /**
     * Indicate that the event is past.
     */
    public function past(): static
    {
        $startDate = $this->faker->dateTimeBetween('-6 months', '-1 day');
        $endDate = $this->faker->dateTimeBetween($startDate, $startDate->format('Y-m-d H:i:s') . ' +1 week');

        return $this->state(fn (array $attributes) => [
            'start_date' => $startDate,
            'end_date' => $endDate,
            'status' => 'completed',
        ]);
    }
}
