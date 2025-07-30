import React from 'react';
import { Head } from '@inertiajs/react';
import { Calendar, Users, CalendarDays } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import StatsCard from '@/components/ui/stats-card';
import EventsChart from '@/components/ui/events-chart';
import { type BreadcrumbItem } from '@/types';

interface DashboardStats {
    totalEvents: number;
    totalUsers: number;
    upcomingEvents: number;
}

interface ChartDataPoint {
    date: string;
    count: number;
    formattedDate: string;
}

interface DashboardProps {
    stats: DashboardStats;
    chartData: ChartDataPoint[];
    statusOptions: Record<string, string>;
    currentStatusFilter?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ 
    stats, 
    chartData, 
    statusOptions, 
    currentStatusFilter 
}: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <StatsCard
                        title="Total Events"
                        value={stats.totalEvents}
                        icon={Calendar}
                        description="All events in the system"
                    />
                    <StatsCard
                        title="Total Users"
                        value={stats.totalUsers}
                        icon={Users}
                        description="Registered users"
                    />
                    <StatsCard
                        title="Upcoming Events"
                        value={stats.upcomingEvents}
                        icon={CalendarDays}
                        description="Events scheduled for the future"
                    />
                </div>

                {/* Events Chart */}
                <div className="flex-1">
                    <EventsChart
                        data={chartData}
                        statusOptions={statusOptions}
                        currentStatusFilter={currentStatusFilter}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
