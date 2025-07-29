import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Mail, MailCheck, Calendar, Shield } from 'lucide-react';
import type { User } from '../types';

interface ViewUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onEdit?: (user: User) => void;
}

export default function ViewUserDialog({ open, onOpenChange, user, onEdit }: ViewUserDialogProps) {
  if (!user) return null;

  const getVerificationStatus = () => {
    if (user.email_verified_at) {
      return (
        <div className="flex items-center gap-2 text-green-600">
          <MailCheck className="h-4 w-4" />
          <span>Verified on {new Date(user.email_verified_at).toLocaleDateString()}</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 text-orange-600">
        <Mail className="h-4 w-4" />
        <span>Email not verified</span>
      </div>
    );
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(user);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            View user information and role assignment.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Basic Information</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <p className="text-sm text-muted-foreground">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email Address</label>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">UUID</label>
                  <p className="text-sm text-muted-foreground font-mono">{user.uuid}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Status Information */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Status</h4>
              <div className="space-y-2">
                {getVerificationStatus()}
              </div>
            </div>

            <Separator />

            {/* Role */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Role</h4>
              <div className="flex flex-wrap gap-2">
                {user.roles && user.roles.length > 0 ? (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    {user.roles[0].name}
                  </Badge>
                ) : (
                  <Badge variant="secondary">No role assigned</Badge>
                )}
              </div>
            </div>

            <Separator />

            {/* Timestamps */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Account Information</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>Created: {new Date(user.created_at).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>Updated: {new Date(user.updated_at).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {onEdit && (
            <Button onClick={handleEdit}>
              Edit User
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}