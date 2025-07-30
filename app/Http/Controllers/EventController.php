<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Events\StoreEventRequest;
use App\Models\Event;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            'auth',
            new Middleware('permission:can:view:event', only: ['index', 'show']),
            new Middleware('permission:can:create:event', only: ['create', 'store']),
            new Middleware('permission:can:update:event', only: ['edit', 'update']),
            new Middleware('permission:can:delete:event', only: ['destroy']),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $events = Event::query()
            ->with('user')
            // Filter events based on user role
            ->when(!auth()->user()->hasRole('admin'), function ($query) {
                // If user is not admin, only show their own events
                $query->where('user_id', auth()->id());
            })
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('location', 'like', "%{$search}%");
                });
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->visibility, function ($query, $visibility) {
                if ($visibility === 'public') {
                    $query->where('is_public', true);
                } elseif ($visibility === 'private') {
                    $query->where('is_public', false);
                }
            })
            ->when($request->date_filter, function ($query, $dateFilter) {
                switch ($dateFilter) {
                    case 'upcoming':
                        $query->where('start_date', '>', now());
                        break;
                    case 'ongoing':
                        $query->where('start_date', '<=', now())
                              ->where('end_date', '>=', now());
                        break;
                    case 'past':
                        $query->where('end_date', '<', now());
                        break;
                }
            })
            ->orderBy('start_date', 'desc')
            ->paginate($request->get('per_page', 10))
            ->withQueryString();

        return Inertia::render('events/index', [
            'events' => $events,
            'filters' => $request->only(['search', 'status', 'visibility', 'date_filter']),
            'statusOptions' => Event::getStatusOptions(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('events/create', [
            'statusOptions' => Event::getStatusOptions(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEventRequest $request): RedirectResponse
    {
        try {
            $event = Event::create([
                'title' => $request->title,
                'description' => $request->description,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'location' => $request->location,
                'max_attendees' => $request->max_attendees,
                'is_public' => $request->boolean('is_public', false),
                'status' => $request->status,
                'user_id' => auth()->id(),
            ]);

            return redirect()->route('events.index')
                ->with('success', 'Event created successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to create event. Please try again.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Event $event): Response
    {
        $event->load('user');

        return Inertia::render('events/show', [
            'event' => $event,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Event $event): Response
    {
        $event->load('user');

        return Inertia::render('events/edit', [
            'event' => $event,
            'statusOptions' => Event::getStatusOptions(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreEventRequest $request, Event $event): RedirectResponse
    {
        try {
            $event->update([
                'title' => $request->title,
                'description' => $request->description,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'location' => $request->location,
                'max_attendees' => $request->max_attendees,
                'is_public' => $request->boolean('is_public', false),
                'status' => $request->status,
            ]);

            return redirect()->route('events.index')
                ->with('success', 'Event updated successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to update event. Please try again.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event): RedirectResponse
    {
        try {
            // Only allow deletion by event owner or admin
            if ($event->user_id !== auth()->id() && !auth()->user()->hasRole('admin')) {
                return redirect()->back()
                    ->with('error', 'You can only delete your own events.');
            }

            $event->delete();

            return redirect()->route('events.index')
                ->with('success', 'Event deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to delete event. Please try again.');
        }
    }
}