import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, User } from 'lucide-react';
import type { User as UserType } from '../types';

interface UserRoleDisplayProps {
  user: UserType;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

export default function UserRoleDisplay({ 
  user, 
  variant = 'outline' 
}: UserRoleDisplayProps) {
  if (!user.roles || user.roles.length === 0) {
    return (
      <Badge variant="secondary" className="text-xs">
        <User className="h-3 w-3 mr-1" />
        No role
      </Badge>
    );
  }

  // Display only the first role since users can only have one role
  const role = user.roles[0];

  return (
    <Badge variant={variant} className="text-xs">
      <Shield className="h-3 w-3 mr-1" />
      {role.name}
    </Badge>
  );
}