export interface CalendarEvent {
    id: number;
    uuid: string;
    title: string;
    start: Date;
    end: Date;
    description: string;
    location: string;
    max_attendees: number;
    is_public: boolean;
    status: string;
    user_name: string;
    is_owner: boolean;
}