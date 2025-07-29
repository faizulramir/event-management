import React from 'react';
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
import type { CreatePermissionData } from '../types';

interface CreatePermissionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreatePermissionForm({ open, onOpenChange }: CreatePermissionFormProps) {
  const { data, setData, post, processing, errors, reset } = useForm<CreatePermissionData>({
    name: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post(route('permissions.store'), {
      onSuccess: () => {
        toast.success('Permission created successfully');
        reset();
        onOpenChange(false);
      },
      onError: (errors) => {
        toast.error(errors.message || 'Failed to create permission');
      },
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Permission</DialogTitle>
          <DialogDescription>
            Create a new permission.
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
              {processing ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}