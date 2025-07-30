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

// Basic validation functions
export const validateCreateEvent = (data: CreateEventFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Title validation
  if (!data.title.trim()) {
    errors.title = ['Event title is required'];
  } else if (data.title.length > 255) {
    errors.title = ['Event title must not exceed 255 characters'];
  }

  // Description validation
  if (data.description && data.description.length > 5000) {
    errors.description = ['Description must not exceed 5000 characters'];
  }

  // Start date validation
  if (!data.start_date) {
    errors.start_date = ['Start date is required'];
  } else {
    const startDate = new Date(data.start_date);
    if (startDate <= new Date()) {
      errors.start_date = ['Start date must be in the future'];
    }
  }

  // End date validation
  if (!data.end_date) {
    errors.end_date = ['End date is required'];
  } else if (data.start_date) {
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    if (endDate <= startDate) {
      errors.end_date = ['End date must be after start date'];
    }
  }

  // Location validation
  if (data.location && data.location.length > 255) {
    errors.location = ['Location must not exceed 255 characters'];
  }

  // Max attendees validation
  if (data.max_attendees) {
    const maxAttendees = parseInt(data.max_attendees);
    if (isNaN(maxAttendees) || maxAttendees < 1) {
      errors.max_attendees = ['Maximum attendees must be at least 1'];
    } else if (maxAttendees > 10000) {
      errors.max_attendees = ['Maximum attendees must not exceed 10000'];
    }
  }

  // Status validation
  if (!data.status) {
    errors.status = ['Status is required'];
  }

  return errors;
};

export const validateUpdateEvent = (data: UpdateEventFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Title validation
  if (!data.title.trim()) {
    errors.title = ['Event title is required'];
  } else if (data.title.length > 255) {
    errors.title = ['Event title must not exceed 255 characters'];
  }

  // Description validation
  if (data.description && data.description.length > 5000) {
    errors.description = ['Description must not exceed 5000 characters'];
  }

  // Start date validation
  if (!data.start_date) {
    errors.start_date = ['Start date is required'];
  }

  // End date validation
  if (!data.end_date) {
    errors.end_date = ['End date is required'];
  } else if (data.start_date) {
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    if (endDate <= startDate) {
      errors.end_date = ['End date must be after start date'];
    }
  }

  // Location validation
  if (data.location && data.location.length > 255) {
    errors.location = ['Location must not exceed 255 characters'];
  }

  // Max attendees validation
  if (data.max_attendees) {
    const maxAttendees = parseInt(data.max_attendees);
    if (isNaN(maxAttendees) || maxAttendees < 1) {
      errors.max_attendees = ['Maximum attendees must be at least 1'];
    } else if (maxAttendees > 10000) {
      errors.max_attendees = ['Maximum attendees must not exceed 10000'];
    }
  }

  // Status validation
  if (!data.status) {
    errors.status = ['Status is required'];
  }

  return errors;
};