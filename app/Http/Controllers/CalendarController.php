<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CalendarController extends Controller
{
    /**
     * Display the calendar view with events.
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        
        // Build the query based on user role
        $query = Event::query();
        
        // If user is not admin, only show their events and public events
        if (!$user->hasRole('admin')) {
            $query->where(function ($q) use ($user) {
                $q->where('user_id', $user->id)
                  ->orWhere('is_public', true);
            });
        }
        
        // Get events with user relationship
        $events = $query->with('user:id,name')
            ->select([
                'id',
                'uuid',
                'title',
                'description',
                'start_date',
                'end_date',
                'location',
                'max_attendees',
                'is_public',
                'status',
                'user_id'
            ])
            ->orderBy('start_date')
            ->get();
        
        // Transform events for react-big-calendar format
        $calendarEvents = $events->map(function ($event) {
            return [
                'id' => $event->id,
                'uuid' => $event->uuid,
                'title' => $event->title,
                'start' => $event->start_date,
                'end' => $event->end_date,
                'description' => $event->description,
                'location' => $event->location,
                'max_attendees' => $event->max_attendees,
                'is_public' => $event->is_public,
                'status' => $event->status,
                'user_name' => $event->user->name,
                'is_owner' => $event->user_id === auth()->id(),
            ];
        });
        
        return Inertia::render('calendar/index', [
            'events' => $calendarEvents,
            'canCreateEvents' => $user->can('create', Event::class),
        ]);
    }
}