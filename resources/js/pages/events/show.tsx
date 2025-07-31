import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, MapPin, Users, Clock, User, Globe, Lock, Edit, Trash2 } from 'lucide-react';
import type { Event } from '@/features/events/types';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { formatDateLong, formatDateOnly, formatTimeOnly } from '@/lib/utils';

interface EventShowPageProps {
    event: Event;
}

export default function EventShowPage({ event }: EventShowPageProps) {
    const breadcrumbs = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Events', href: route('events.index') },
        { title: event.title, href: route('events.show', event.uuid) },
    ];

    const getStatusBadge = (status: string) => {
        const variants = {
            draft: 'secondary',
            active: 'default',
            cancelled: 'destructive',
            completed: 'outline',
        } as const;

        return (
            <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const isSameDay = new Date(event.start_date).toDateString() === new Date(event.end_date).toDateString();

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={`Event: ${event.title}`} />

                <div className="space-y-6 p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button variant="outline" size="sm" asChild>
                                <Link href={route('events.index')}>
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Events
                                </Link>
                            </Button>
                            <Heading title={event.title} description="Event details and information" />
                        </div>
                        <div className="flex items-center space-x-2">
                            {getStatusBadge(event.status)}
                            <Badge variant={event.is_public ? 'default' : 'secondary'}>
                                {event.is_public ? (
                                    <>
                                        <Globe className="mr-1 h-3 w-3" />
                                        Public
                                    </>
                                ) : (
                                    <>
                                        <Lock className="mr-1 h-3 w-3" />
                                        Private
                                    </>
                                )}
                            </Badge>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Description */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Description</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {event.description ? (
                                        <div
                                            className="text-gray-700 prose prose-sm max-w-none"
                                            dangerouslySetInnerHTML={{ __html: event.description }}
                                        />
                                    ) : (
                                        <p className="text-gray-500 italic">No description provided</p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Date & Time */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Calendar className="mr-2 h-5 w-5" />
                                        Date & Time
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {isSameDay ? (
                                            <>
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-medium">Date:</span>
                                                    <span>{formatDateOnly(event.start_date)}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Clock className="h-4 w-4 text-gray-500" />
                                                    <span className="font-medium">Time:</span>
                                                    <span>{formatTimeOnly(event.start_date)} - {formatTimeOnly(event.end_date)}</span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-medium">Start:</span>
                                                    <span>{formatDateLong(event.start_date)}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-medium">End:</span>
                                                    <span>{formatDateLong(event.end_date)}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Event Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Event Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Location */}
                                    <div className="flex items-start space-x-2">
                                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                                        <div>
                                            <span className="font-medium">Location:</span>
                                            <p className="text-sm text-gray-600">
                                                {event.location || 'No location specified'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Max Attendees */}
                                    <div className="flex items-center space-x-2">
                                        <Users className="h-4 w-4 text-gray-500" />
                                        <span className="font-medium">Max Attendees:</span>
                                        <span className="text-sm text-gray-600">
                                            {event.max_attendees ? event.max_attendees.toLocaleString() : 'Unlimited'}
                                        </span>
                                    </div>

                                    {/* Organizer */}
                                    <div className="flex items-start space-x-2">
                                        <User className="h-4 w-4 text-gray-500 mt-0.5" />
                                        <div>
                                            <span className="font-medium">Organizer:</span>
                                            <p className="text-sm text-gray-600">{event.user?.name || 'Unknown'}</p>
                                            <p className="text-xs text-gray-500">{event.user?.email || 'No email'}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Event Meta */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Event Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Event ID:</span>
                                        <span className="text-sm text-gray-600 font-mono">{event.uuid}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Created:</span>
                                        <span className="text-sm text-gray-600">
                                            {new Date(event.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Updated:</span>
                                        <span className="text-sm text-gray-600">
                                            {new Date(event.updated_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Button asChild className="w-full">
                                        <Link href={route('events.edit', event.uuid)}>
                                            Edit Event
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}