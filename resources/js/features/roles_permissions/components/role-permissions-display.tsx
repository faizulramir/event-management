import React from 'react';
import PermissionBadge from './permission-badge';
import type { Role } from '../types';

interface RolePermissionsDisplayProps {
  role: Role;
  maxDisplay?: number;
}

export default function RolePermissionsDisplay({ role, maxDisplay = 3 }: RolePermissionsDisplayProps) {
  const permissions = role.permissions || [];
  const displayPermissions = permissions.slice(0, maxDisplay);
  const remainingCount = permissions.length - maxDisplay;

  if (permissions.length === 0) {
    return (
      <span className="text-muted-foreground text-sm">No permissions</span>
    );
  }

  return (
    <div className="flex flex-wrap gap-1">
      {displayPermissions.map((permission) => (
        <PermissionBadge key={permission.id} permission={permission} variant="outline" />
      ))}
      {remainingCount > 0 && (
        <span className="text-muted-foreground text-sm">
          +{remainingCount} more
        </span>
      )}
    </div>
  );
}