import React from 'react';
import { Badge } from '@/components/ui/badge';
import type { Permission } from '../types';

interface PermissionBadgeProps {
  permission: Permission;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

export default function PermissionBadge({ permission, variant = 'secondary' }: PermissionBadgeProps) {
  return (
    <Badge variant={variant} className="font-mono text-xs">
      {permission.name}
    </Badge>
  );
}