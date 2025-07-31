<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
    /**
     * Display the welcome page with public events.
     */
    public function index(Request $request): Response
    {
        $events = Event::query()
            ->with('user')
            ->public()
            ->active()
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('location', 'like', "%{$search}%");
                });
            })
            ->orderBy('start_date', 'asc')
            ->paginate($request->get('per_page', 12))
            ->withQueryString();

        return Inertia::render('welcome', [
            'events' => $events,
            'filters' => $request->only(['search']),
        ]);
    }
}