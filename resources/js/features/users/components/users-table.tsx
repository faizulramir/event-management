import React from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EyeIcon, Pencil, Trash2, Mail, MailCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useConfirmationDialog } from '@/components/ui/confirmation-dialog';
import DataTable, {
  type ColumnConfig,
  type FilterConfig,
  type MobileCardConfig,
  type PaginationData,
} from '@/components/data-table';
import type { User, PaginatedUsers } from '../types';

interface UsersTableProps {
  users: PaginatedUsers;
  filters?: Record<string, any>;
  roles?: Array<{ id: number; name: string }>;
  onEdit?: (user: User) => void;
  onView?: (user: User) => void;
}

export default function UsersTable({ 
  users, 
  filters = {}, 
  roles = [],
  onEdit,
  onView 
}: UsersTableProps) {
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const handleDeleteClick = (user: User) => {
    showConfirmation({
      title: 'Delete User',
      description: `Are you sure you want to delete the user ${user.name}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'destructive',
      onConfirm: () => handleDeleteConfirm(user),
    });
  };

  const handleDeleteConfirm = (user: User) => {
    router.delete(route('users.destroy', user.uuid), {
      onSuccess: () => {
        toast.success('User deleted successfully');
      },
      onError: (errors) => {
        toast.error(errors.message || 'Failed to delete user');
      },
    });
  };

  const handleEdit = (user: User) => {
    if (onEdit) {
      onEdit(user);
    } else {
      router.visit(route('users.edit', user.uuid));
    }
  };

  const handleView = (user: User) => {
    if (onView) {
      onView(user);
    } else {
      router.visit(route('users.show', user.uuid));
    }
  };

  const getVerificationBadge = (user: User) => {
    if (user.email_verified_at) {
      return (
        <Badge variant="default" className="text-xs">
          <MailCheck className="h-3 w-3 mr-1" />
          Verified
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="text-xs">
        <Mail className="h-3 w-3 mr-1" />
        Unverified
      </Badge>
    );
  };

  const getRoleBadge = (user: User) => {
    if (!user.roles || user.roles.length === 0) {
      return <Badge variant="outline" className="text-xs">No role</Badge>;
    }

    // Display only the first role since users can only have one role
    const role = user.roles[0];
    return (
      <Badge key={role.id} variant="outline" className="text-xs">
        {role.name}
      </Badge>
    );
  };

  const columns: ColumnConfig<User>[] = [
    {
      key: 'name',
      label: 'Name',
      render: (user) => (
        <div className="flex flex-col">
          <span className="font-medium">{user.name}</span>
          <span className="text-sm text-muted-foreground">{user.email}</span>
        </div>
      ),
    },
    {
      key: 'email_verified_at',
      label: 'Status',
      render: (user) => getVerificationBadge(user),
    },
    {
      key: 'roles',
      label: 'Role',
      render: (user) => getRoleBadge(user),
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (user) => (
        <div className="text-muted-foreground">
          {new Date(user.created_at).toLocaleDateString()}
        </div>
      ),
    },
  ];

  const mobileCardConfig: MobileCardConfig<User> = {
    title: (user) => (
      <div className="flex items-center justify-between">
        <span className="font-medium">{user.name}</span>
        {getVerificationBadge(user)}
      </div>
    ),
    subtitle: (user) => user.email,
    badge: (user) => {
      if (!user.roles || user.roles.length === 0) {
        return <Badge variant="outline">No role</Badge>;
      }
      return <Badge variant="outline">{user.roles[0].name}</Badge>;
    },
    content: (user) => (
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">Role:</span>
          <div className="text-right">
            {getRoleBadge(user)}
          </div>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Created:</span>
          <span>{new Date(user.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    ),
  };

  const filterConfigs: FilterConfig[] = [
    {
      key: 'verified',
      label: 'Status',
      options: [
        { label: 'Verified', value: 'verified' },
        { label: 'Unverified', value: 'unverified' },
      ],
      placeholder: 'All Status',
    },
    ...(roles.length > 0 ? [{
      key: 'role',
      label: 'Role',
      options: roles.map(role => ({
        label: role.name,
        value: role.name,
      })),
      placeholder: 'All Roles',
    }] : []),
  ];

  const pagination: PaginationData = {
    current_page: users.current_page,
    last_page: users.last_page,
    per_page: users.per_page,
    total: users.total,
    from: users.from,
    to: users.to,
  };

  return (
    <>
      <DataTable
        data={users.data}
        columns={columns}
        pagination={pagination}
        filters={filters}
        filterConfigs={filterConfigs}
        searchConfig={{
          enabled: true,
          placeholder: 'Search users by name or email',
        }}
        mobileCardConfig={mobileCardConfig}
        emptyMessage="No users found"
        onRowClick={handleView}
        actionsConfig={{
          render: (user) => (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleView(user)}
                title="View user"
              >
                <EyeIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(user)}
                title="Edit user"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteClick(user)}
                className="text-destructive hover:text-destructive"
                title="Delete user"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ),
          mobileRender: (user) => (
            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleView(user)}
                title="View user"
              >
                <EyeIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(user)}
                title="Edit user"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteClick(user)}
                className="text-destructive hover:text-destructive"
                title="Delete user"
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