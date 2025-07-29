import React, { useState } from 'react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { toast } from 'sonner';
import type { CreateUserData } from '../types';

interface CreateUserFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    roles?: Array<{ id: number; name: string }>;
}

export default function CreateUserForm({ open, onOpenChange, roles = [] }: CreateUserFormProps) {
    const { data, setData, post, processing, errors, reset } = useForm<CreateUserData>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('users.store'), {
            onSuccess: () => {
                toast.success('User created successfully');
                reset();
                onOpenChange(false);
            },
            onError: (errors) => {
                toast.error(errors.message || 'Failed to create user');
            },
        });
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            reset();
            setShowPassword(false);
            setShowPasswordConfirmation(false);
        }
        onOpenChange(newOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Create User</DialogTitle>
                    <DialogDescription>
                        Create a new user account with an optional role assignment.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <ScrollArea className="max-h-[60vh] pr-4">
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Enter full name"
                                    className={errors.name ? 'border-destructive' : ''}
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">{errors.name}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Enter email address"
                                    className={errors.email ? 'border-destructive' : ''}
                                />
                                {errors.email && (
                                    <p className="text-sm text-destructive">{errors.email}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Enter password"
                                        className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOffIcon className="h-4 w-4" />
                                        ) : (
                                            <EyeIcon className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-destructive">{errors.password}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">Confirm Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password_confirmation"
                                        type={showPasswordConfirmation ? 'text' : 'password'}
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Confirm password"
                                        className={errors.password_confirmation ? 'border-destructive pr-10' : 'pr-10'}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                    >
                                        {showPasswordConfirmation ? (
                                            <EyeOffIcon className="h-4 w-4" />
                                        ) : (
                                            <EyeIcon className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                                {errors.password_confirmation && (
                                    <p className="text-sm text-destructive">{errors.password_confirmation}</p>
                                )}
                            </div>

                            {roles.length > 0 && (
                                <div className="grid gap-2">
                                    <Label htmlFor="role">User Role</Label>
                                    <Select
                                        value={data.role || ''}
                                        onValueChange={(value) => setData('role', value === 'none' ? '' : value)}
                                    >
                                        <SelectTrigger className={errors.role ? 'border-destructive' : ''}>
                                            <SelectValue placeholder="Select a role (optional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">No role assigned</SelectItem>
                                            {roles.map((role) => (
                                                <SelectItem key={role.id} value={role.name}>
                                                    {role.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.role && (
                                        <p className="text-sm text-destructive">{errors.role}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                    <DialogFooter className="mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create User'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}