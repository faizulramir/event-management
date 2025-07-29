import React from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EyeIcon, Pencil, Shield, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useConfirmationDialog } from '@/components/ui/confirmation-dialog';
import DataTable, {
  type ColumnConfig,
  type FilterConfig,
  type MobileCardConfig,
  type PaginationData,
} from '@/components/data-table';
import RolePermissionsDisplay from './role-permissions-display';
import type { Role, PaginatedRoles } from '../types';

const PROTECTED_ROLES = ['admin', 'user'];

interface RolesTableProps {
  roles: PaginatedRoles;
  filters?: Record<string, any>;
  onEdit?: (role: Role) => void;
}

export default function RolesTable({ roles, filters = {}, onEdit }: RolesTableProps) {
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const handleDeleteClick = (role: Role) => {
    if (PROTECTED_ROLES.includes(role.name)) {
      toast.error('Delete protected roles is not allowed');
      return;
    }
    showConfirmation({
      title: 'Delete Role',
      description: `Are you sure you want to delete the role ${role.name}?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'destructive',
      onConfirm: () => handleDeleteConfirm(role),
    });
  };

  const handleDeleteConfirm = (role: Role) => {
    router.delete(route('roles.destroy', role.id), {
      onSuccess: () => {
        toast.success('Role deleted successfully');
      },
      onError: (errors) => {
        toast.error(errors.message || 'Failed to delete role');
      },
    });
  };

  const handleEdit = (role: Role) => {
    if (onEdit) {
      onEdit(role);
    } else {
      router.visit(route('roles.edit', role.id));
    }
  };

  const getRoleBadgeVariant = (roleName: string) => {
    switch (roleName) {
      case 'admin':
        return 'destructive';
      case 'user':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const columns: ColumnConfig<Role>[] = [
    {
      key: 'name',
      label: 'Role',
      render: (role) => (
        <div className="flex items-center gap-2">
          <Badge variant={getRoleBadgeVariant(role.name)} className="font-mono text-xs">
            {role.name}
          </Badge>
          {PROTECTED_ROLES.includes(role.name) && (
            <Shield className="h-3 w-3 text-muted-foreground" />
          )}
        </div>
      ),
    },
    {
      key: 'permissions',
      label: 'Permissions',
      render: (role) => <RolePermissionsDisplay role={role} maxDisplay={2} />,
    },
    {
      key: 'guard_name',
      label: 'Guard',
      render: (role) => <Badge variant="outline">{role.guard_name}</Badge>,
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (role) => (
        <div className="text-muted-foreground">
          {new Date(role.created_at).toLocaleDateString()}
        </div>
      ),
    },
  ];

  const mobileCardConfig: MobileCardConfig<Role> = {
    title: (role) => (
      <div className="flex items-center gap-2">
        <Badge variant={getRoleBadgeVariant(role.name)} className="font-mono text-xs">
          {role.name}
        </Badge>
        {PROTECTED_ROLES.includes(role.name) && (
          <Shield className="h-3 w-3 text-muted-foreground" />
        )}
      </div>
    ),
    subtitle: (role) => `Guard: ${role.guard_name}`,
    badge: (role) => (
      <Badge variant="outline">
        {`Permissions: ${role.permissions?.length || 0}`}
      </Badge>
    ),
    content: (role) => (
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">Permissions:</span>
          <div className="text-right">
            <RolePermissionsDisplay role={role} maxDisplay={2} />
          </div>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Created:</span>
          <span>{new Date(role.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    ),
  };

  const pagination: PaginationData = {
    current_page: roles.current_page,
    last_page: roles.last_page,
    per_page: roles.per_page,
    total: roles.total,
    from: roles.from,
    to: roles.to,
  };

  return (
    <>
      <DataTable
        data={roles.data}
        columns={columns}
        pagination={pagination}
        filters={filters}
        searchConfig={{
          enabled: true,
          placeholder: 'Search roles',
        }}
        mobileCardConfig={mobileCardConfig}
        emptyMessage="No roles found"
        actionsConfig={{
          render: (role) => (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(role)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              {!PROTECTED_ROLES.includes(role.name) && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteClick(role)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ),
          mobileRender: (role) => (
            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(role)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              {!PROTECTED_ROLES.includes(role.name) && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteClick(role)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ),
        }}
      />

      <ConfirmationDialog />
    </>
  );
}