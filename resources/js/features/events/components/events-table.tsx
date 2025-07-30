import React from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EyeIcon, Pencil, Trash2, Calendar, MapPin, Users, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useConfirmationDialog } from '@/components/ui/confirmation-dialog';
import DataTable, {
  type ColumnConfig,
  type FilterConfig,
  type MobileCardConfig,
  type PaginationData,
} from '@/components/data-table';
import type { Event, PaginatedEvents } from '../types';

interface EventsTableProps {
  events: PaginatedEvents;
  filters?: Record<string, any>;
  onEdit?: (event: Event) => void;
  onView?: (event: Event) => void;
}

export default function EventsTable({ 
  events, 
  filters = {},
  onEdit,
  onView 
}: EventsTableProps) {
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const handleDeleteClick = (event: Event) => {
    showConfirmation({
      title: 'Delete Event',
      description: `Are you sure you want to delete the event "${event.title}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'destructive',
      onConfirm: () => handleDeleteConfirm(event),
    });
  };

  const handleDeleteConfirm = (event: Event) => {
    router.delete(route('events.destroy', event.uuid), {
      onSuccess: () => {
        toast.success('Event deleted successfully');
      },
      onError: (errors) => {
        toast.error(errors.message || 'Failed to delete event');
      },
    });
  };

  const handleEdit = (event: Event) => {
    if (onEdit) {
      onEdit(event);
    } else {
      router.visit(route('events.edit', event.uuid));
    }
  };

  const handleView = (event: Event) => {
    if (onView) {
      onView(event);
    } else {
      router.visit(route('events.show', event.uuid));
    }
  };

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

  const getVisibilityBadge = (isPublic: boolean) => {
    return (
      <Badge variant={isPublic ? 'default' : 'secondary'}>
        {isPublic ? 'Public' : 'Private'}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start.toDateString() === end.toDateString()) {
      // Same day
      return `${start.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })} ${start.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })} - ${end.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
    } else {
      // Different days
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
  };

  // Helper function to safely render HTML content
  const renderHtmlContent = (htmlContent: string) => {
    // Strip HTML tags for preview or render safely
    const stripHtml = (html: string) => {
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || '';
    };

    // For table display, we'll show plain text version with line clamp
    // For full view, we could render HTML safely
    return stripHtml(htmlContent);
  };

  const columns: ColumnConfig<Event>[] = [
    {
      key: 'title',
      label: 'Event',
      render: (event) => (
        <div className="max-w-xs">
          <div className="font-medium truncate">{event.title}</div>
          {event.description && (
            <div className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {renderHtmlContent(event.description)}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'start_date',
      label: 'Date & Time',
      render: (event) => (
        <div className="flex items-start space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="text-sm min-w-0">
            <div className="truncate">{formatDateRange(event.start_date, event.end_date)}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      render: (event) => (
        event.location ? (
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm truncate max-w-32">{event.location}</span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">No location</span>
        )
      ),
    },
    {
      key: 'max_attendees',
      label: 'Attendees',
      render: (event) => (
        event.max_attendees ? (
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Max {event.max_attendees}</span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">Unlimited</span>
        )
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (event) => getStatusBadge(event.status),
    },
    {
      key: 'is_public',
      label: 'Visibility',
      render: (event) => getVisibilityBadge(event.is_public),
    },
    {
      key: 'user',
      label: 'Organizer',
      render: (event) => (
        <div className="text-sm">
          <div className="font-medium">{event.user?.name || 'Unknown'}</div>
          <div className="text-muted-foreground truncate max-w-32">{event.user?.email || 'No email'}</div>
        </div>
      ),
    },
  ];

  const mobileCardConfig: MobileCardConfig<Event> = {
    title: (event) => (
      <div className="flex items-center justify-between">
        <span className="font-medium truncate">{event.title}</span>
        {getStatusBadge(event.status)}
      </div>
    ),
    subtitle: (event) => (
      <div className="flex items-center space-x-1 text-muted-foreground">
        <Calendar className="h-3 w-3" />
        <span className="text-xs">{formatDate(event.start_date)}</span>
      </div>
    ),
    badge: (event) => getVisibilityBadge(event.is_public),
    content: (event) => (
      <div className="space-y-2 text-sm">
        {event.description && (
          <div className="text-muted-foreground line-clamp-2">
            {renderHtmlContent(event.description)}
          </div>
        )}
        <div className="flex justify-between">
          <span className="font-medium">Date:</span>
          <span className="text-right text-xs">{formatDateRange(event.start_date, event.end_date)}</span>
        </div>
        {event.location && (
          <div className="flex justify-between">
            <span className="font-medium">Location:</span>
            <span className="text-right truncate max-w-32">{event.location}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="font-medium">Attendees:</span>
          <span>{event.max_attendees ? `Max ${event.max_attendees}` : 'Unlimited'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Organizer:</span>
          <span className="text-right truncate max-w-32">{event.user?.name || 'Unknown'}</span>
        </div>
      </div>
    ),
  };

  const filterConfigs: FilterConfig[] = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Active', value: 'active' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Completed', value: 'completed' },
      ],
      placeholder: 'All Status',
    },
    {
      key: 'visibility',
      label: 'Visibility',
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Private', value: 'private' },
      ],
      placeholder: 'All Visibility',
    },
  ];

  const pagination: PaginationData = {
    current_page: events.current_page,
    last_page: events.last_page,
    per_page: events.per_page,
    total: events.total,
    from: events.from,
    to: events.to,
  };

  return (
    <>
      <DataTable
        data={events.data}
        columns={columns}
        pagination={pagination}
        filters={filters}
        filterConfigs={filterConfigs}
        searchConfig={{
          enabled: true,
          placeholder: 'Search events by title, description, or location',
        }}
        mobileCardConfig={mobileCardConfig}
        emptyMessage="No events found"
        onRowClick={handleView}
        actionsConfig={{
          render: (event) => (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleView(event)}
                title="View event"
              >
                <EyeIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(event)}
                title="Edit event"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteClick(event)}
                className="text-destructive hover:text-destructive"
                title="Delete event"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ),
          mobileRender: (event) => (
            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleView(event)}
                title="View event"
              >
                <EyeIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(event)}
                title="Edit event"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteClick(event)}
                className="text-destructive hover:text-destructive"
                title="Delete event"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ),
        }}
      />

      <ConfirmationDialog />
    </>
  );
}