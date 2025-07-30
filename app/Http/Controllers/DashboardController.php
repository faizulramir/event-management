<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with statistics and chart data.
     */
    public function index(Request $request): Response
    {
        // Get basic statistics
        $totalEvents = Event::count();
        $totalUsers = User::count();
        $upcomingEvents = Event::where('start_date', '>', now())->count();

        // Get chart data for events registered over time
        $chartData = $this->getEventsChartData($request->get('status_filter'));

        return Inertia::render('dashboard', [
            'stats' => [
                'totalEvents' => $totalEvents,
                'totalUsers' => $totalUsers,
                'upcomingEvents' => $upcomingEvents,
            ],
            'chartData' => $chartData,
            'statusOptions' => Event::getStatusOptions(),
            'currentStatusFilter' => $request->get('status_filter'),
        ]);
    }

    /**
     * Get events chart data grouped by creation date.
     */
    private function getEventsChartData(?string $statusFilter = null): array
    {
        $query = Event::query();

        // Apply status filter if provided
        if ($statusFilter) {
            $query->where('status', $statusFilter);
        }

        // Get events from the last 30 days grouped by date
        $events = $query
            ->where('created_at', '>=', now()->subDays(30))
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Create a complete date range for the last 30 days
        $dateRange = collect();
        for ($i = 29; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $dateRange->push([
                'date' => $date,
                'count' => 0,
                'formattedDate' => Carbon::parse($date)->format('M j'),
            ]);
        }

        // Merge actual data with the date range
        $chartData = $dateRange->map(function ($item) use ($events) {
            $eventData = $events->firstWhere('date', $item['date']);
            return [
                'date' => $item['date'],
                'count' => $eventData ? $eventData->count : 0,
                'formattedDate' => $item['formattedDate'],
            ];
        });

        return $chartData->toArray();
    }
}