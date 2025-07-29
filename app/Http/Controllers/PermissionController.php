<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Permissions\StorePermissionRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Illuminate\Routing\Controllers\Middleware;

class PermissionController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            'auth',
            new Middleware('permission:can:view:permission', only: ['index', 'show']),
            new Middleware('permission:can:create:permission', only: ['create', 'store']),
            new Middleware('permission:can:update:permission', only: ['edit', 'update']),
            new Middleware('permission:can:delete:permission', only: ['destroy']),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $permissions = Permission::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->paginate($request->get('per_page', 10))
            ->withQueryString();

        return Inertia::render('permissions/index', [
            'permissions' => $permissions,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('permissions/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePermissionRequest $request): RedirectResponse
    {
        try {
            Permission::create([
                'name' => $request->name,
                'guard_name' => 'web',
            ]);

            return redirect()->route('permissions.index')
                ->with('success', __('messages.permission_created'));
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', __('messages.permission_create_failed'));
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Permission $permission): Response
    {
        return Inertia::render('permissions/show', [
            'permission' => $permission,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Permission $permission): Response
    {
        return Inertia::render('permissions/edit', [
            'permission' => $permission,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StorePermissionRequest $request, Permission $permission): RedirectResponse
    {
        try {
            $permission->update([
                'name' => $request->name,
            ]);

            return redirect()->route('permissions.index')
                ->with('success', __('messages.permission_updated'));
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', __('messages.permission_update_failed'));
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Permission $permission): RedirectResponse
    {
        try {
            $permission->delete();

            return redirect()->route('permissions.index')
                ->with('success', __('messages.permission_deleted'));
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', __('messages.permission_delete_failed'));
        }
    }
}
