import { Link, Head, router, usePage } from '@inertiajs/react';
import { Event, PaginatedEvents } from '@/features/events/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Search, Clock, X } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { SharedData } from '@/types';
import { formatDateRange } from '@/lib/utils';

interface WelcomeProps {
    events: PaginatedEvents;
    search?: string;
}

export default function Welcome({ events, search = '' }: WelcomeProps) {
    const { auth } = usePage<SharedData>().props;
    const [searchValue, setSearchValue] = useState(search);
    const [isSearching, setIsSearching] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const previousSearchRef = useRef<string>(search);

    // Debounced search
    const debouncedSearch = useCallback(
        (query: string) => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }

            searchTimeoutRef.current = setTimeout(() => {
                if (query !== previousSearchRef.current) {
                    setIsSearching(true);
                    router.get(
                        window.location.pathname,
                        {
                            search: query || undefined,
                            page: 1,
                        },
                        {
                            preserveState: true,
                            preserveScroll: true,
                            onFinish: () => setIsSearching(false),
                        },
                    );
                    previousSearchRef.current = query;
                }
            }, 300);
        },
        [],
    );

    useEffect(() => {
        debouncedSearch(searchValue);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchValue, debouncedSearch]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    useEffect(() => {
        if (search !== searchValue) {
            setSearchValue(search || '');
            previousSearchRef.current = search || '';
        }
    }, [search]);

    const clearSearch = () => {
        setSearchValue('');
        previousSearchRef.current = '';
        router.get(
            window.location.pathname,
            { page: 1 },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const getStatusBadge = (status: string) => {
        const statusColors = {
            'draft': 'secondary',
            'published': 'default',
            'cancelled': 'destructive',
            'completed': 'outline',
        } as const;

        return (
            <Badge variant={statusColors[status as keyof typeof statusColors] || 'secondary'}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    return (
        <>
            <Head title="Welcome - Discover Events" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 dark:bg-gray-900/80 dark:border-gray-700 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-8 w-8 text-blue-600" />
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">EventHub</h1>
                            </div>
                            <nav className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <Link
                                            href={route('login')}
                                            className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg transition-colors dark:text-gray-300 dark:hover:text-blue-400"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                                        >
                                            Register
                                        </Link>
                                    </div>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                            Discover Amazing
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Events</span>
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                            Find and join exciting events happening around you. From workshops to conferences, discover experiences that matter.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto">
                            <div className="relative flex-1 md:max-w-md mx-auto">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search events by title, description, or location..."
                                    value={searchValue}
                                    onChange={handleSearchChange}
                                    className="pl-10 pr-10"
                                />
                                {searchValue && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-muted"
                                        onClick={clearSearch}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                )}
                                {isSearching && (
                                    <div className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Events Section */}
                <section className="py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {search ? `Search Results for "${search}"` : 'Upcoming Public Events'}
                            </h3>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                {events.total} {events.total === 1 ? 'event' : 'events'} found
                            </div>
                        </div>

                        {events.data.length > 0 ? (
                            <>
                                {/* Events Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                    {events.data.map((event) => (
                                        <Card key={event.uuid} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
                                            <CardHeader className="pb-3">
                                                <div className="flex justify-between items-start mb-2">
                                                    <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                        {event.title}
                                                    </CardTitle>
                                                    {getStatusBadge(event.status)}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                    <Clock className="h-4 w-4 mr-1" />
                                                    {formatDateRange(event.start_date, event.end_date)}
                                                </div>
                                            </CardHeader>
                                            <CardContent className="pt-0 flex flex-col flex-grow">
                                                <div className="flex-grow">
                                                    {event.description && (
                                                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                                                            {event.description.replace(/<[^>]*>/g, '')}
                                                        </p>
                                                    )}

                                                    <div className="space-y-2 mb-4">
                                                        {event.location ? (
                                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                                                                <span className="truncate">{event.location}</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                                                                <span className="truncate">Not specified</span>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                            <Users className="h-4 w-4 mr-2" />
                                                            <span>{event.max_attendees || 0} max attendees</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <Button
                                                    variant="outline"
                                                    className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all mt-auto"
                                                    onClick={() => router.visit(route('events.show', event.uuid))}
                                                >
                                                    View Details
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {events.last_page > 1 && (
                                    <div className="flex justify-center items-center space-x-2">
                                        {events.links.map((link, index) => (
                                            <Button
                                                key={index}
                                                variant={link.active ? "default" : "outline"}
                                                size="sm"
                                                disabled={!link.url}
                                                onClick={() => link.url && router.visit(link.url)}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className="min-w-[40px]"
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-16">
                                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    {search ? 'No events found' : 'No events available'}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    {search
                                        ? 'Try adjusting your search terms or browse all events.'
                                        : 'Check back later for upcoming events.'
                                    }
                                </p>
                                {search && (
                                    <Button
                                        variant="outline"
                                        onClick={clearSearch}
                                    >
                                        Clear Search
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            © 2024 EventHub. Discover and join amazing events.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
