import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import PermissionBadge from './permission-badge';
import type { Role, UpdateRoleData, Permission } from '../types';

interface EditRoleFormProps {
  role: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  permissions: Permission[];
}

export default function EditRoleForm({ role, open, onOpenChange, permissions }: EditRoleFormProps) {
  const { data, setData, put, processing, errors, reset } = useForm<UpdateRoleData>({
    name: '',
    permissions: [],
  });

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (role) {
      setData({ name: role.name });
      const rolePermissionNames = role.permissions?.map(p => p.name) || [];
      setSelectedPermissions(rolePermissionNames);
    }
  }, [role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    put(route('roles.update', role?.id), {
      onSuccess: () => {
        toast.success('Role updated successfully');
        reset();
        onOpenChange(false);
      },
      onError: (errors) => {
        toast.error(errors.message || 'Failed to update role');
      },
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset();
      setSelectedPermissions(role?.permissions?.map(p => p.name) || []);
    }
    onOpenChange(newOpen);
  };

  const handlePermissionChange = (permissionName: string, checked: boolean) => {
    let updatedPermissions: string[];
    if (checked) {
      updatedPermissions = [...selectedPermissions, permissionName];
    } else {
      updatedPermissions = selectedPermissions.filter(p => p !== permissionName);
    }

    setSelectedPermissions(updatedPermissions);
    setData({ ...data, permissions: updatedPermissions });
  };

  const selectAllPermissions = () => {
    const allPermissionNames = permissions.map(p => p.name);
    setSelectedPermissions(allPermissionNames);
    setData({ ...data, permissions: allPermissionNames });
  };

  const clearAllPermissions = () => {
    setSelectedPermissions([]);
    setData({ ...data, permissions: [] });
  };

  if (!role) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
          <DialogDescription>
            Edit the name and permissions of the role.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Role Name</Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData({ name: e.target.value })}
                placeholder="Enter role name"
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Role Permissions</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={selectAllPermissions}
                  >
                    Select All
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={clearAllPermissions}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
              <ScrollArea className="h-[200px] w-full border rounded-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {permissions.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`permission-${permission.id}`}
                        checked={selectedPermissions.includes(permission.name)}
                        onCheckedChange={(checked) =>
                          handlePermissionChange(permission.name, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`permission-${permission.id}`}
                        className="text-sm font-normal cursor-pointer flex-1"
                      >
                        <PermissionBadge permission={permission} />
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              {errors.permissions && (
                <p className="text-sm text-destructive">{errors.permissions}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? 'Updating...' : 'Update Role'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}