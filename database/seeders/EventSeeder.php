<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing users or create some if none exist
        $users = User::all();
        
        if ($users->isEmpty()) {
            echo "No users found, creating 5 users with 'user' role...\n";
            $users = User::factory(5)->create();
            
            // Assign 'user' role to newly created users
            foreach ($users as $user) {
                $user->assignRole('user');
            }
        }

        // Create a variety of events
        foreach ($users as $user) {
            // Create 2-4 events per user
            $eventCount = rand(2, 4);

            // Assign 'user' role if user doesn't have any roles
            if (!$user->hasAnyRole()) {
                $user->assignRole('user');
            }

            Event::factory($eventCount)
                ->for($user)
                ->create();
        }

        // Create some specific example events
        $adminUser = User::whereHas('roles', function ($query) {
            $query->where('name', 'admin');
        })->first();

        if ($adminUser) {
            // Create a public upcoming conference
            Event::factory()
                ->for($adminUser)
                ->public()
                ->upcoming()
                ->create([
                    'title' => 'Annual Tech Conference 2025',
                    'description' => 'Join us for the biggest tech conference of the year featuring industry leaders, innovative workshops, and networking opportunities.',
                    'location' => 'Convention Center, Downtown',
                    'max_attendees' => 500,
                ]);

            // Create a workshop series
            Event::factory()
                ->for($adminUser)
                ->public()
                ->upcoming()
                ->create([
                    'title' => 'Laravel Development Workshop',
                    'description' => 'Learn advanced Laravel techniques in this hands-on workshop. Perfect for developers looking to enhance their skills.',
                    'location' => 'Tech Hub, Room 201',
                    'max_attendees' => 30,
                ]);

            // Create a networking event
            Event::factory()
                ->for($adminUser)
                ->public()
                ->upcoming()
                ->create([
                    'title' => 'Monthly Developer Meetup',
                    'description' => 'Connect with fellow developers, share experiences, and learn about the latest trends in software development.',
                    'location' => 'Coffee & Code Cafe',
                    'max_attendees' => 50,
                ]);
        }

        // Create some past events using existing users
        $randomUsers = User::inRandomOrder()->limit(10)->get();
        foreach ($randomUsers as $user) {
            Event::factory()
                ->for($user)
                ->past()
                ->public()
                ->create();
        }

        // Create some draft events using existing users
        $draftUsers = User::inRandomOrder()->limit(5)->get();
        foreach ($draftUsers as $user) {
            Event::factory()
                ->for($user)
                ->create(['status' => 'draft']);
        }
    }
}
