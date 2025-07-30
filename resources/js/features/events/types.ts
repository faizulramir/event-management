export type Event = {
  id: number;
  uuid: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  location: string | null;
  max_attendees: number | null;
  is_public: boolean;
  status: 'draft' | 'active' | 'cancelled' | 'completed';
  user_id: number;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    uuid: string;
    name: string;
    email: string;
  };
}

export type CreateEventData = {
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  location?: string;
  max_attendees?: number;
  is_public: boolean;
  status: 'draft' | 'active' | 'cancelled' | 'completed';
}

export type UpdateEventData = {
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  location?: string;
  max_attendees?: number;
  is_public: boolean;
  status: 'draft' | 'active' | 'cancelled' | 'completed';
}

export type PaginatedEvents = {
  data: Event[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
}

export type EventFilters = {
  search?: string;
  status?: string;
  visibility?: string;
  date_filter?: string;
}

export type StatusOption = {
  value: string;
  label: string;
}

// Form data types for event creation and updates
export type CreateEventFormData = {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  max_attendees: string;
  is_public: boolean;
  status: 'draft' | 'active' | 'cancelled' | 'completed';
};

export type UpdateEventFormData = {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  max_attendees: string;
  is_public: boolean;
  status: 'draft' | 'active' | 'cancelled' | 'completed';
};

// Validation error type
export type ValidationErrors = Record<string, string[]>;