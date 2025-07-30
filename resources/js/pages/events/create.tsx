import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import EventForm from '@/features/events/components/event-form';

interface CreateEventPageProps {
    statusOptions: Record<string, string>;
}

export default function CreateEventPage({ statusOptions }: CreateEventPageProps) {
    const breadcrumbs = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Events', href: route('events.index') },
        { title: 'Create Event', href: route('events.create') },
    ];

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Create Event" />

                <div className="space-y-6 p-6">
                    {/* Header */}
                    <Heading title="Create Event" description="Fill in the details to create a new event" />

                    {/* Form */}
                    <EventForm
                        mode="create"
                        statusOptions={statusOptions}
                        backUrl={route('events.index')}
                        onSuccess={() => {
                            router.visit(route('events.index'))
                        }}
                    />
                </div>
            </AppLayout>
        </>
    );
}