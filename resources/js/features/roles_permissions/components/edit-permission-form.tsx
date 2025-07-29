import React, { useEffect } from 'react';
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
import { toast } from 'sonner';
import type { Permission, UpdatePermissionData } from '../types.js';

interface EditPermissionFormProps {
  permission: Permission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditPermissionForm({ permission, open, onOpenChange }: EditPermissionFormProps) {
  const { data, setData, put, processing, errors, reset } = useForm<UpdatePermissionData>({
    name: '',
  });

  useEffect(() => {
    if (permission) {
      setData({ name: permission.name });
    }
  }, [permission]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!permission) return;

    put(route('permissions.update', permission.id), {
      onSuccess: () => {
        toast.success('Permission updated successfully');
        reset();
        onOpenChange(false);
      },
      onError: (errors) => {
        toast.error(errors.message || 'Failed to update permission');
      },
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset();
    }
    onOpenChange(newOpen);
  };

  if (!permission) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Permission</DialogTitle>
          <DialogDescription>
            Edit the name of the permission.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Permission Name</Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData({ name: e.target.value })}
                placeholder="Enter permission name"
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? 'Updating' : 'Update'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}