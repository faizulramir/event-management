export type Permission = {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

export type Role = {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  permissions?: Permission[];
}

export type CreatePermissionData = {
  name: string;
}

export type CreateRoleData = {
  name: string;
  permissions?: string[];
}

export type UpdatePermissionData = {
  name: string;
}

export type UpdateRoleData = {
  name: string;
  permissions?: string[];
}

export type PaginatedPermissions = {
  data: Permission[];
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

export type PaginatedRoles = {
  data: Role[];
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

export type RoleFilters = {
  search?: string;
}