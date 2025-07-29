export type User = {
  id: number;
  uuid: string;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  roles?: Array<{
    id: number;
    name: string;
    guard_name: string;
  }>;
}

export type CreateUserData = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: string;
}

export type UpdateUserData = {
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  role?: string;
}

export type PaginatedUsers = {
  data: User[];
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

export type UserFilters = {
  search?: string;
  role?: string;
  verified?: string;
}