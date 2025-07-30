import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import type { PaginatedEvents, Event, EventFilters } from '@/features/events/types';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import EventsTable from '@/features/events/components/events-table';

interface EventsPageProps {
    events: PaginatedEvents;
    filters: EventFilters;
    statusOptions: Record<string, string>;
}

export default function EventsPage({ events, filters, statusOptions }: EventsPageProps) {
    const handleEdit = (event: Event) => {
        window.location.href = route('events.edit', event.uuid);
    };

    const handleView = (event: Event) => {
        window.location.href = route('events.show', event.uuid);
    };

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
                                onEdit={handleEdit}
                                onView={handleView}
                            />
                        </CardContent>
                    </Card>


                </div>
            </AppLayout>
        </>
    );
}