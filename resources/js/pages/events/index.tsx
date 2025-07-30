import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import type { PaginatedEvents, EventFilters } from '@/features/events/types';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import EventsTable from '@/features/events/components/events-table';

interface EventsPageProps {
    events: PaginatedEvents;
    filters: EventFilters;
}

export default function EventsPage({ events, filters }: EventsPageProps) {
    const breadcrumbs = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Events', href: route('events.index') },
    ];

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Events Management" />

                <div className="space-y-6 p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <Heading title="Events" description="Manage events and their details" />
                        <Button asChild>
                            <Link href={route('events.create')}>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Event
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent>
                            {/* Events Table */}
                            <EventsTable
                                events={events}
                                filters={filters}
                            />
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        </>
    );
}