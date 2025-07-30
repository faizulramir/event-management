import React, { useState, useEffect } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FroalaEditor } from '@/components/froala-editor';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { validateCreateEvent, validateUpdateEvent, type CreateEventFormData, type UpdateEventFormData, type ValidationErrors } from '../validation';
import type { Event } from '../types';

interface EventFormProps {
    mode: 'create' | 'edit';
    event?: Event;
    statusOptions: Record<string, string>;
    onSuccess?: () => void;
    onCancel?: () => void;
    backUrl?: string;
    title?: string;
    description?: string;
}

export default function EventForm({
    mode,
    event,
    statusOptions,
    onSuccess,
    onCancel,
    backUrl,
    title,
    description
}: EventFormProps) {
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const isEdit = mode === 'edit';

    // Initialize form data based on mode
    const getInitialData = () => {
        if (isEdit && event) {
            const startDate = new Date(event.start_date);
            const endDate = new Date(event.end_date);

            return {
                title: event.title,
                description: event.description || '',
                start_date: startDate.toISOString().slice(0, 16),
                end_date: endDate.toISOString().slice(0, 16),
                location: event.location || '',
                max_attendees: event.max_attendees?.toString() || '',
                is_public: Boolean(event.is_public),
                status: event.status as 'draft' | 'active' | 'cancelled' | 'completed',
            };
        }

        return {
            title: '',
            description: '',
            start_date: '',
            end_date: '',
            location: '',
            max_attendees: '',
            is_public: false as boolean,
            status: 'draft' as 'draft' | 'active' | 'cancelled' | 'completed',
        };
    };

    const { data, setData, post, put, processing, errors, reset } = useForm(getInitialData());

    // Update form data when event changes (for edit mode)
    useEffect(() => {
        if (isEdit && event) {
            const startDate = new Date(event.start_date);
            const endDate = new Date(event.end_date);

            setData({
                title: event.title,
                description: event.description || '',
                start_date: startDate.toISOString().slice(0, 16),
                end_date: endDate.toISOString().slice(0, 16),
                location: event.location || '',
                max_attendees: event.max_attendees?.toString() || '',
                is_public: Boolean(event.is_public),
                status: event.status as 'draft' | 'active' | 'cancelled' | 'completed',
            });
        }
    }, [event, isEdit]);

    const validateForm = (): boolean => {
        const formErrors = isEdit ? validateUpdateEvent(data) : validateCreateEvent(data);
        setValidationErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const submitData = {
            ...data,
            max_attendees: data.max_attendees ? parseInt(data.max_attendees) : null,
        };

        const successMessage = isEdit ? 'Event updated successfully' : 'Event created successfully';
        const errorMessage = isEdit ? 'Failed to update event' : 'Failed to create event';

        const submitOptions = {
            onSuccess: () => {
                toast.success(successMessage);
                if (onSuccess) {
                    onSuccess();
                } else if (!isEdit) {
                    reset();
                    setValidationErrors({});
                }
            },
            onError: () => {
                toast.error(errorMessage);
            },
        };

        if (isEdit && event) {
            put(route('events.update', event.uuid), submitOptions);
        } else {
            post(route('events.store'), submitOptions);
        }
    };

    const clearFieldError = (field: string) => {
        if (validationErrors[field]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else if (backUrl) {
            window.location.href = backUrl;
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>{title || (isEdit ? 'Edit Event' : 'Create New Event')}</CardTitle>
                        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
                    </div>
                    {backUrl && (
                        <Button variant="outline" size="sm" asChild>
                            <Link href={backUrl}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Link>
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Event Title *</Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => {
                                setData('title', e.target.value);
                                clearFieldError('title');
                            }}
                            className={validationErrors.title || errors.title ? 'border-destructive' : ''}
                            placeholder="Enter event title"
                        />
                        {validationErrors.title && (
                            <p className="text-sm text-destructive">{validationErrors.title[0]}</p>
                        )}
                        {errors.title && (
                            <p className="text-sm text-destructive">{errors.title}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <FroalaEditor
                            value={data.description}
                            onChange={(content) => {
                                setData('description', content);
                                clearFieldError('description');
                            }}
                            placeholder="Enter event description"
                            error={!!(validationErrors.description || errors.description)}
                            height={200}
                        />
                        {validationErrors.description && (
                            <p className="text-sm text-destructive">{validationErrors.description[0]}</p>
                        )}
                        {errors.description && (
                            <p className="text-sm text-destructive">{errors.description}</p>
                        )}
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="start_date">Start Date & Time *</Label>
                            <Input
                                id="start_date"
                                type="datetime-local"
                                value={data.start_date}
                                onChange={(e) => {
                                    setData('start_date', e.target.value);
                                    clearFieldError('start_date');
                                }}
                                className={validationErrors.start_date || errors.start_date ? 'border-destructive' : ''}
                            />
                            {validationErrors.start_date && (
                                <p className="text-sm text-destructive">{validationErrors.start_date[0]}</p>
                            )}
                            {errors.start_date && (
                                <p className="text-sm text-destructive">{errors.start_date}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="end_date">End Date & Time *</Label>
                            <Input
                                id="end_date"
                                type="datetime-local"
                                value={data.end_date}
                                onChange={(e) => {
                                    setData('end_date', e.target.value);
                                    clearFieldError('end_date');
                                }}
                                className={validationErrors.end_date || errors.end_date ? 'border-destructive' : ''}
                            />
                            {validationErrors.end_date && (
                                <p className="text-sm text-destructive">{validationErrors.end_date[0]}</p>
                            )}
                            {errors.end_date && (
                                <p className="text-sm text-destructive">{errors.end_date}</p>
                            )}
                        </div>
                    </div>

                    {/* Location and Max Attendees */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={data.location}
                                onChange={(e) => {
                                    setData('location', e.target.value);
                                    clearFieldError('location');
                                }}
                                className={validationErrors.location || errors.location ? 'border-destructive' : ''}
                                placeholder="Enter event location"
                            />
                            {validationErrors.location && (
                                <p className="text-sm text-destructive">{validationErrors.location[0]}</p>
                            )}
                            {errors.location && (
                                <p className="text-sm text-destructive">{errors.location}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="max_attendees">Max Attendees</Label>
                            <Input
                                id="max_attendees"
                                type="number"
                                min="1"
                                value={data.max_attendees}
                                onChange={(e) => {
                                    setData('max_attendees', e.target.value);
                                    clearFieldError('max_attendees');
                                }}
                                className={validationErrors.max_attendees || errors.max_attendees ? 'border-destructive' : ''}
                                placeholder="Leave empty for unlimited"
                            />
                            {validationErrors.max_attendees && (
                                <p className="text-sm text-destructive">{validationErrors.max_attendees[0]}</p>
                            )}
                            {errors.max_attendees && (
                                <p className="text-sm text-destructive">{errors.max_attendees}</p>
                            )}
                        </div>
                    </div>

                    {/* Status and Visibility */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={data.status}
                                onValueChange={(value) => {
                                    setData('status', value as 'draft' | 'active' | 'cancelled' | 'completed');
                                    clearFieldError('status');
                                }}
                            >
                                <SelectTrigger className={validationErrors.status || errors.status ? 'border-destructive' : ''}>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(statusOptions).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {validationErrors.status && (
                                <p className="text-sm text-destructive">{validationErrors.status[0]}</p>
                            )}
                            {errors.status && (
                                <p className="text-sm text-destructive">{errors.status}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="is_public">Visibility</Label>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="is_public"
                                    checked={data.is_public}
                                    onCheckedChange={(checked) => setData('is_public', checked)}
                                />
                                <Label htmlFor="is_public" className="text-sm">
                                    {data.is_public ? 'Public Event' : 'Private Event'}
                                </Label>
                            </div>
                            {validationErrors.is_public && (
                                <p className="text-sm text-destructive">{validationErrors.is_public[0]}</p>
                            )}
                            {errors.is_public && (
                                <p className="text-sm text-destructive">{errors.is_public}</p>
                            )}
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            {isEdit ? 'Update Event' : 'Create Event'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}