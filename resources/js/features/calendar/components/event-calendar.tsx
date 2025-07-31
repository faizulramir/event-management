import React, { useState, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, View, Views } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { enUS } from 'date-fns/locale/en-US';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Users, Clock } from 'lucide-react';
import { router } from '@inertiajs/react';
import { CalendarEvent } from '../types';

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

interface EventCalendarProps {
    events: CalendarEvent[];
}

const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    published: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
};

export default function EventCalendar({ events }: EventCalendarProps) {
    const [view, setView] = useState<View>(Views.MONTH);
    const [date, setDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

    // Transform events for react-big-calendar
    const calendarEvents = events.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
    }));

    const handleSelectEvent = useCallback((event: CalendarEvent) => {
        setSelectedEvent(event);
    }, []);

    const handleNavigate = useCallback((newDate: Date) => {
        setDate(newDate);
    }, []);

    const handleViewChange = useCallback((newView: View) => {
        setView(newView);
    }, []);

    const eventStyleGetter = (event: CalendarEvent) => {
        let backgroundColor = '#3174ad';

        switch (event.status) {
            case 'published':
                backgroundColor = '#10b981';
                break;
            case 'cancelled':
                backgroundColor = '#ef4444';
                break;
            case 'completed':
                backgroundColor = '#6366f1';
                break;
            case 'draft':
                backgroundColor = '#6b7280';
                break;
        }

        return {
            style: {
                backgroundColor,
                borderRadius: '4px',
                opacity: 0.8,
                color: 'white',
                border: '0px',
                display: 'block',
            },
        };
    };

    const CustomEvent = ({ event }: { event: CalendarEvent }) => (
        <div className="text-xs">
            <div className="font-medium truncate">{event.title}</div>
            {event.location && (
                <div className="flex items-center gap-1 opacity-75">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{event.location}</span>
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Calendar Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Event Calendar</h1>
                    <p className="text-muted-foreground">
                        View all public and self events in calendar format
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Calendar */}
                <div className="lg:col-span-3">
                    <Card>
                        <CardContent className="p-6">
                            <div style={{ height: '600px' }}>
                                <Calendar
                                    localizer={localizer}
                                    events={calendarEvents}
                                    startAccessor="start"
                                    endAccessor="end"
                                    view={view}
                                    date={date}
                                    onNavigate={handleNavigate}
                                    onView={handleViewChange}
                                    onSelectEvent={handleSelectEvent}
                                    eventPropGetter={eventStyleGetter}
                                    components={{
                                        event: CustomEvent,
                                    }}
                                    views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                                    step={60}
                                    showMultiDayTimes
                                    popup
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Event Details Sidebar */}
                <div className="lg:col-span-1">
                    {selectedEvent ? (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">{selectedEvent.title}</CardTitle>
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant="secondary"
                                        className={statusColors[selectedEvent.status as keyof typeof statusColors]}
                                    >
                                        {selectedEvent.status}
                                    </Badge>
                                    {!selectedEvent.is_public && (
                                        <Badge variant="outline">Private</Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                        <div className="text-sm">
                                            <div>{format(new Date(selectedEvent.start), 'PPP p')}</div>
                                            <div className="text-muted-foreground">
                                                to {format(new Date(selectedEvent.end), 'PPP p')}
                                            </div>
                                        </div>
                                    </div>

                                    {selectedEvent.location && (
                                        <div className="flex items-start gap-2">
                                            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                            <div className="text-sm">{selectedEvent.location}</div>
                                        </div>
                                    )}

                                    <div className="flex items-start gap-2">
                                        <Users className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                        <div className="text-sm">
                                            Max {selectedEvent.max_attendees} attendees
                                        </div>
                                    </div>

                                    <div className="text-sm">
                                        <span className="text-muted-foreground">Organizer:</span>{' '}
                                        {selectedEvent.user_name}
                                    </div>
                                </div>

                                {selectedEvent.description && (
                                    <div>
                                        <h4 className="font-medium mb-2">Description</h4>
                                        <div
                                            className="text-sm text-muted-foreground prose prose-sm max-w-none"
                                            dangerouslySetInnerHTML={{ __html: selectedEvent.description }}
                                        />
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.visit(`/events/${selectedEvent.uuid}`)}
                                        className="flex-1"
                                    >
                                        View Details
                                    </Button>
                                    {selectedEvent.is_owner && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.visit(`/events/${selectedEvent.uuid}/edit`)}
                                            className="flex-1"
                                        >
                                            Edit
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="p-6 text-center">
                                <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="font-medium mb-2">Select an Event</h3>
                                <p className="text-sm text-muted-foreground">
                                    Click on an event in the calendar to view its details
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}