import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import EventCalendar from '@/features/calendar/components/event-calendar';
import { type BreadcrumbItem } from '@/types';
import { CalendarEvent } from '@/features/calendar/types';

interface CalendarIndexProps {
    events: Array<Omit<CalendarEvent, 'start' | 'end'> & { start: string; end: string }>;
    canCreateEvents: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Calendar',
        href: '/calendar',
    },
];

export default function CalendarIndex({ events, canCreateEvents }: CalendarIndexProps) {
    // Convert string dates to Date objects for react-big-calendar
    const calendarEvents: CalendarEvent[] = events.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Calendar" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                <EventCalendar events={calendarEvents} canCreateEvents={canCreateEvents} />
            </div>
        </AppLayout>
    );
}
