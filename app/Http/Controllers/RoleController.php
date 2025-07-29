<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Http\Requests\Roles\StoreRoleRequest;

class RoleController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            'auth',
            new Middleware('permission:can:view:role', only: ['index', 'show']),
            new Middleware('permission:can:create:role', only: ['create', 'store']),
            new Middleware('permission:can:update:role', only: ['edit', 'update']),
            new Middleware('permission:can:delete:role', only: ['destroy']),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $roles = Role::query()
            ->with('permissions')
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->paginate($request->get('per_page', 10))
            ->withQueryString();

        $permissions = Permission::orderBy('name')->get();

        return Inertia::render('roles/index', [
            'roles' => $roles,
            'permissions' => $permissions,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $permissions = Permission::orderBy('name')->get();

        return Inertia::render('roles/create', [
            'permissions' => $permissions,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRoleRequest $request): RedirectResponse
    {
        try {
            $role = Role::create([
                'name' => $request->name,
                'guard_name' => 'web',
            ]);

            if ($request->permissions) {
                $role->syncPermissions($request->permissions);
            }

            return redirect()->route('roles.index')
                ->with('success', 'Role created successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to create role. Please try again.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role): Response
    {
        $role->load('permissions');

        return Inertia::render('roles/show', [
            'role' => $role,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role): Response
    {
        $permissions = Permission::orderBy('name')->get();
        $role->load('permissions');

        return Inertia::render('roles/edit', [
            'role' => $role,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreRoleRequest $request, Role $role): RedirectResponse
    {
        try {
            $role->update([
                'name' => $request->name,
            ]);

            if ($request->has('permissions')) {
                $role->syncPermissions($request->permissions ?? []);
            }

            return redirect()->route('roles.index')
                ->with('success', 'Role updated successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to update role. Please try again.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role): RedirectResponse
    {
        try {
            // Prevent deletion of default roles
            if (in_array($role->name, ['admin', 'user'])) {
                return redirect()->back()
                    ->with('error', 'Cannot delete system roles.');
            }

            $role->delete();

            return redirect()->route('roles.index')
                ->with('success', 'Role deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to delete role. Please try again.');
        }
    }
}
