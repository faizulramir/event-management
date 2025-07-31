import { Event } from '@/features/events/types';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Clock, User, Eye, EyeOff } from 'lucide-react';
import { formatDateRange, formatDateLong, formatTimeOnly } from '@/lib/utils';

interface EventDetailsModalProps {
    event: Event | null;
    isOpen: boolean;
    onClose: () => void;
}

export function EventDetailsModal({ event, isOpen, onClose }: EventDetailsModalProps) {
    if (!event) return null;

    const getStatusBadge = (status: string) => {
        const statusColors = {
            'draft': 'secondary',
            'active': 'default',
            'cancelled': 'destructive',
            'completed': 'outline',
        } as const;

        return (
            <Badge variant={statusColors[status as keyof typeof statusColors] || 'secondary'}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const getVisibilityBadge = (isPublic: boolean) => {
        return (
            <Badge variant={isPublic ? 'default' : 'secondary'} className="flex items-center gap-1">
                {isPublic ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                {isPublic ? 'Public' : 'Private'}
            </Badge>
        );
    };

    const renderHtmlContent = (content: string) => {
        return <div dangerouslySetInnerHTML={{ __html: content }} />;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold pr-8">{event.title}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Status and Visibility Badges */}
                    <div className="flex items-center gap-2">
                        {getStatusBadge(event.status)}
                        {getVisibilityBadge(event.is_public)}
                    </div>

                    {/* Date and Time */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-blue-600" />
                            Date & Time
                        </h3>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
                            <div className="flex justify-between">
                                <span className="font-medium">Start:</span>
                                <span>{formatDateLong(event.start_date)} at {formatTimeOnly(event.start_date)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">End:</span>
                                <span>{formatDateLong(event.end_date)} at {formatTimeOnly(event.end_date)}</span>
                            </div>
                            <div className="flex justify-between border-t pt-2">
                                <span className="font-medium">Duration:</span>
                                <span className="font-medium text-blue-600">{formatDateRange(event.start_date, event.end_date)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    {event.description && (
                        <div className="space-y-3">
                            <h3 className="font-semibold text-lg">Description</h3>
                            <div className="prose prose-sm max-w-none dark:prose-invert">
                                {renderHtmlContent(event.description)}
                            </div>
                        </div>
                    )}

                    {/* Location */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-green-600" />
                            Location
                        </h3>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <p className="text-gray-700 dark:text-gray-300">
                                {event.location || 'Location not specified'}
                            </p>
                        </div>
                    </div>

                    {/* Attendees */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Users className="h-5 w-5 text-purple-600" />
                            Attendees
                        </h3>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <p className="text-gray-700 dark:text-gray-300">
                                {event.max_attendees ? `Maximum ${event.max_attendees} attendees` : 'Unlimited attendees'}
                            </p>
                        </div>
                    </div>

                    {/* Organizer */}
                    {event.user && (
                        <div className="space-y-3">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <User className="h-5 w-5 text-orange-600" />
                                Organizer
                            </h3>
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                <div className="space-y-1">
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {event.user.name}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {event.user.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Event Metadata */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Clock className="h-5 w-5 text-gray-600" />
                            Event Information
                        </h3>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
                            <div className="flex justify-between">
                                <span className="font-medium">Event ID:</span>
                                <span className="text-sm font-mono">{event.uuid}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Created:</span>
                                <span>{formatDateLong(event.created_at)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Last Updated:</span>
                                <span>{formatDateLong(event.updated_at)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Close Button */}
                    <div className="flex justify-end pt-4 border-t">
                        <Button onClick={onClose} variant="outline">
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}