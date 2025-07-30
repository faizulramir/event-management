import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import EventForm from '@/features/events/components/event-form';
import type { Event } from '@/features/events/types';

interface EditEventPageProps {
    event: Event;
    statusOptions: Record<string, string>;
}

export default function EditEventPage({ event, statusOptions }: EditEventPageProps) {
    const breadcrumbs = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Events', href: route('events.index') },
        { title: event.title, href: route('events.show', event.uuid) },
        { title: 'Edit', href: route('events.edit', event.uuid) },
    ];

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={`Edit ${event.title}`} />

                <div className="space-y-6 p-6">
                    {/* Header */}
                    <Heading title={`Edit ${event.title}`} description="Update the event details" />

                    {/* Form */}
                    <EventForm
                        mode="edit"
                        event={event}
                        statusOptions={statusOptions}
                        backUrl={route('events.show', event.uuid)}
                        onSuccess={() => {
                            window.location.href = route('events.show', event.uuid);
                        }}
                    />
                </div>
            </AppLayout>
        </>
    );
}