import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import {
  RolesTable,
  CreateRoleForm,
  EditRoleForm
} from '@/features/roles_permissions';
import type { PaginatedRoles, Role, Permission } from '@/features/roles_permissions';

interface RolesIndexProps {
  roles: PaginatedRoles;
  permissions: Permission[];
  filters: {
    search?: string;
  };
}

export default function RolesIndex({ roles, permissions }: RolesIndexProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const handleEdit = (role: Role) => {
    setEditingRole(role);
  };

  const breadcrumbs = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Roles', href: route('roles.index') },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Roles" />

      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <Heading title="Roles" description="Manage roles and permissions" />
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Role
          </Button>
        </div>

        <Card>
          <CardContent>
            <div className="space-y-4">
              <RolesTable
                roles={roles}
                onEdit={handleEdit}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <CreateRoleForm
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        permissions={permissions}
      />

      <EditRoleForm
        role={editingRole}
        open={!!editingRole}
        onOpenChange={(open: boolean) => !open && setEditingRole(null)}
        permissions={permissions}
      />
    </AppLayout>
  );
}