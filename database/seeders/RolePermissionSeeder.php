<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'admin@gmail.com'], // Condition to check if the user exists
            [
                'uuid' => Str::uuid(),
                'name' => 'Admin',
                'password' => Hash::make('abcd1234'),
            ]
        );

        $permissions = [
            'can:view:audit',
            'can:view:permission',
            'can:create:permission',
            'can:update:permission',
            'can:delete:permission',
            'can:view:role',
            'can:create:role',
            'can:update:role',
            'can:delete:role',
            'can:view:user',
            'can:create:user',
            'can:update:user',
            'can:delete:user',
            'can:view:event',
            'can:create:event',
            'can:update:event',
            'can:delete:event',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $roles = ['admin', 'user'];

        foreach ($roles as $role) {
            $r = Role::firstOrCreate(['name' => $role]);

            if ($role === 'admin') {
                $r->syncPermissions($permissions);
                $user->removeRole($role);
                $user->assignRole($role);
            } else if ($role === 'user') {
                $userPermissions = [
                    'can:view:event',
                    'can:create:event',
                    'can:update:event',
                    'can:delete:event',
                ];
                $r->syncPermissions($userPermissions);
            }
        }
    }
}
