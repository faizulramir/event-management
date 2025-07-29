import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import {
  PermissionsTable,
  CreatePermissionForm,
  EditPermissionForm
} from '@/features/roles_permissions';
import type { PaginatedPermissions, Permission } from '@/features/roles_permissions';
import { BreadcrumbItem } from '@/types';

interface PermissionsIndexProps {
  permissions: PaginatedPermissions;
  filters: {
    search?: string;
  };
}

export default function PermissionsIndex({ permissions }: PermissionsIndexProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);

  const handleEdit = (permission: Permission) => {
    setEditingPermission(permission);
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Permissions', href: route('permissions.index') },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Permissions" />

      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <Heading title="Permissions" description="Manage user permissions" />
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create
          </Button>
        </div>

        <Card>
          <CardContent>
            <PermissionsTable
              permissions={permissions}
              onEdit={handleEdit}
            />
          </CardContent>
        </Card>
      </div>

      <CreatePermissionForm
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
      />

      <EditPermissionForm
        permission={editingPermission}
        open={!!editingPermission}
        onOpenChange={(open: boolean) => !open && setEditingPermission(null)}
      />
    </AppLayout>
  );
}