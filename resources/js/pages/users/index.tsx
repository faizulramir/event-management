import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
    UsersTable,
    CreateUserForm,
    EditUserForm,
    ViewUserDialog
} from '@/features/users';
import type { User, PaginatedUsers } from '@/features/users/types';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import Heading from '@/components/heading';

interface UsersPageProps {
    users: PaginatedUsers;
    filters?: Record<string, any>;
    roles?: Array<{ id: number; name: string }>;
}

export default function UsersPage({ users, filters = {}, roles = [] }: UsersPageProps) {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showViewDialog, setShowViewDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setShowEditForm(true);
    };

    const handleView = (user: User) => {
        setSelectedUser(user);
        setShowViewDialog(true);
    };

    const handleEditFromView = (user: User) => {
        setSelectedUser(user);
        setShowViewDialog(false);
        setShowEditForm(true);
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Users', href: route('users.index') },
    ];

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Users Management" />

                <div className="space-y-6 p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <Heading title="Users" description="Manage user accounts and role assignments" />
                        <Button onClick={() => setShowCreateForm(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create User
                        </Button>
                    </div>
                    <Card>
                        <CardContent>
                            {/* Users Table */}
                            <UsersTable
                                users={users}
                                filters={filters}
                                roles={roles}
                                onEdit={handleEdit}
                                onView={handleView}
                            />
                        </CardContent>
                    </Card>
                    {/* Create User Form */}
                    <CreateUserForm
                        open={showCreateForm}
                        onOpenChange={setShowCreateForm}
                        roles={roles}
                    />

                    {/* Edit User Form */}
                    <EditUserForm
                        open={showEditForm}
                        onOpenChange={setShowEditForm}
                        user={selectedUser}
                        roles={roles}
                    />

                    {/* View User Dialog */}
                    <ViewUserDialog
                        open={showViewDialog}
                        onOpenChange={setShowViewDialog}
                        user={selectedUser}
                        onEdit={handleEditFromView}
                    />
                </div>
            </AppLayout>
        </>
    );
}