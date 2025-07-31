<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
        $chartData = $this->getEventsChartData(
            $request->get('status_filter'),
            $request->get('period', 'month')
        );

        return Inertia::render('dashboard', [
            'stats' => [
                'totalEvents' => $totalEvents,
                'totalUsers' => $totalUsers,
                'upcomingEvents' => $upcomingEvents,
            ],
            'chartData' => $chartData,
            'statusOptions' => Event::getStatusOptions(),
            'currentStatusFilter' => $request->get('status_filter'),
            'currentPeriod' => $request->get('period', 'month'),
            'periodOptions' => [
                ['value' => 'week', 'label' => 'Last 7 Days'],
                ['value' => 'month', 'label' => 'Last 30 Days'],
                ['value' => 'year', 'label' => 'Last 12 Months'],
            ],
        ]);
    }

    /**
     * Get events chart data grouped by creation date.
     */
    private function getEventsChartData(?string $statusFilter = null, string $period = 'month'): array
    {
        $query = Event::query();

        // Apply status filter if provided
        if ($statusFilter) {
            $query->where('status', $statusFilter);
        }

        // Determine date range and grouping based on period
        switch ($period) {
            case 'week':
                $startDate = now()->subDays(6);
                $dateFormat = 'Y-m-d';
                $displayFormat = 'M j';
                $days = 7;
                break;
            case 'year':
                $startDate = now()->subMonths(11)->startOfMonth();
                $dateFormat = 'Y-m';
                $displayFormat = 'M Y';
                $days = 12;
                break;
            case 'month':
            default:
                $startDate = now()->subDays(29);
                $dateFormat = 'Y-m-d';
                $displayFormat = 'M j';
                $days = 30;
                break;
        }

        // Get events grouped by the appropriate time period
        if ($period === 'year') {
            // For year view, group by year-month
            $events = $query
                ->where('created_at', '>=', $startDate)
                ->select(DB::raw("strftime('%Y-%m', created_at) as date"), DB::raw('COUNT(*) as count'))
                ->groupBy('date')
                ->orderBy('date')
                ->get();
        } else {
            // For week and month views, group by date
            $events = $query
                ->where('created_at', '>=', $startDate)
                ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
                ->groupBy('date')
                ->orderBy('date')
                ->get();
        }

        // Create a complete date range
        $dateRange = collect();
        
        if ($period === 'year') {
            // For year view, create monthly intervals
            for ($i = 11; $i >= 0; $i--) {
                $date = now()->subMonths($i)->format($dateFormat);
                $dateRange->push([
                    'date' => $date,
                    'count' => 0,
                    'formattedDate' => Carbon::parse($date . '-01')->format($displayFormat),
                ]);
            }
        } else {
            // For week and month views, create daily intervals
            for ($i = $days - 1; $i >= 0; $i--) {
                $date = now()->subDays($i)->format($dateFormat);
                $dateRange->push([
                    'date' => $date,
                    'count' => 0,
                    'formattedDate' => Carbon::parse($date)->format($displayFormat),
                ]);
            }
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