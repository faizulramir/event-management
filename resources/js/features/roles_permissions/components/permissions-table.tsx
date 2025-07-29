import React from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EyeIcon, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useConfirmationDialog } from '@/components/ui/confirmation-dialog';
import DataTable, {
  type ColumnConfig,
  type FilterConfig,
  type MobileCardConfig,
  type PaginationData,
} from '@/components/data-table';
import type { Permission, PaginatedPermissions } from '../types';

interface PermissionsTableProps {
  permissions: PaginatedPermissions;
  filters?: Record<string, any>;
  onEdit?: (permission: Permission) => void;
}

export default function PermissionsTable({ permissions, filters = {}, onEdit }: PermissionsTableProps) {
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const handleDeleteClick = (permission: Permission) => {
    showConfirmation({
      title: 'Delete Permission',
      description: `Are you sure you want to delete the permission ${permission.name}?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'destructive',
      onConfirm: () => handleDeleteConfirm(permission),
    });
  };

  const handleDeleteConfirm = (permission: Permission) => {
    router.delete(route('permissions.destroy', permission.id), {
      onSuccess: () => {
        toast.success('Permission deleted successfully');
      },
      onError: (errors) => {
        toast.error(errors.message || 'Failed to delete permission');
      },
    });
  };

  const handleEdit = (permission: Permission) => {
    if (onEdit) {
      onEdit(permission);
    } else {
      router.visit(route('permissions.edit', permission.id));
    }
  };

  const getPermissionBadgeVariant = (permissionName: string) => {
    if (permissionName.includes('create')) return 'default';
    if (permissionName.includes('edit') || permissionName.includes('update')) return 'secondary';
    if (permissionName.includes('delete') || permissionName.includes('destroy')) return 'destructive';
    if (permissionName.includes('view') || permissionName.includes('read')) return 'outline';
    return 'outline';
  };

  const columns: ColumnConfig<Permission>[] = [
    {
      key: 'name',
      label: 'Permission',
      render: (permission) => (
        <Badge variant={getPermissionBadgeVariant(permission.name)} className="font-mono text-xs">
          {permission.name}
        </Badge>
      ),
    },
    {
      key: 'guard_name',
      label: 'Guard',
      render: (permission) => <Badge variant="outline">{permission.guard_name}</Badge>,
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (permission) => (
        <div className="text-muted-foreground">
          {new Date(permission.created_at).toLocaleDateString()}
        </div>
      ),
    },
  ];

  const mobileCardConfig: MobileCardConfig<Permission> = {
    title: (permission) => (
      <Badge variant={getPermissionBadgeVariant(permission.name)} className="font-mono text-xs">
        {permission.name}
      </Badge>
    ),
    subtitle: (permission) => `${'Guard'}: ${permission.guard_name}`,
    content: (permission) => (
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">{''}:</span>
          <Badge variant="outline">{permission.guard_name}</Badge>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">{''}:</span>
          <span>{new Date(permission.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    ),
  };

  const pagination: PaginationData = {
    current_page: permissions.current_page,
    last_page: permissions.last_page,
    per_page: permissions.per_page,
    total: permissions.total,
    from: permissions.from,
    to: permissions.to,
  };

  return (
    <>
      <DataTable
        data={permissions.data}
        columns={columns}
        pagination={pagination}
        filters={filters}
        searchConfig={{
          enabled: true,
          placeholder: 'Search permissions',
        }}
        mobileCardConfig={mobileCardConfig}
        emptyMessage={'No permissions found'}
        actionsConfig={{
          render: (permission) => (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(permission)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteClick(permission)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ),
          mobileRender: (permission) => (
            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(permission)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteClick(permission)}
                className="text-destructive hover:text-destructive"
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