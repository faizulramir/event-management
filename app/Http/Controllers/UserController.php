<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Users\StoreUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            'auth',
            new Middleware('permission:can:view:user', only: ['index', 'show']),
            new Middleware('permission:can:create:user', only: ['create', 'store']),
            new Middleware('permission:can:update:user', only: ['edit', 'update']),
            new Middleware('permission:can:delete:user', only: ['destroy']),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $users = User::query()
            ->with('roles')
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($request->verified, function ($query, $verified) {
                if ($verified === 'verified') {
                    $query->whereNotNull('email_verified_at');
                } elseif ($verified === 'unverified') {
                    $query->whereNull('email_verified_at');
                }
            })
            ->when($request->role, function ($query, $role) {
                $query->whereHas('roles', function ($q) use ($role) {
                    $q->where('name', $role);
                });
            })
            ->orderBy('name')
            ->paginate($request->get('per_page', 10))
            ->withQueryString();

        $roles = Role::orderBy('name')->get();

        return Inertia::render('users/index', [
            'users' => $users,
            'roles' => $roles,
            'filters' => $request->only(['search', 'verified']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $roles = Role::orderBy('name')->get();

        return Inertia::render('users/create', [
            'roles' => $roles,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request): RedirectResponse
    {
        try {
            $user = User::create([
                'uuid' => Str::uuid(),
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            if ($request->role) {
                $user->assignRole($request->role);
            }

            return redirect()->route('users.index')
                ->with('success', 'User created successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to create user. Please try again.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user): Response
    {
        $user->load('roles');

        return Inertia::render('users/show', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user): Response
    {
        $roles = Role::orderBy('name')->get();
        $user->load('roles');

        return Inertia::render('users/edit', [
            'user' => $user,
            'roles' => $roles,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreUserRequest $request, User $user): RedirectResponse
    {
        try {
            $updateData = [
                'name' => $request->name,
                'email' => $request->email,
            ];

            // Only update password if provided
            if ($request->filled('password')) {
                $updateData['password'] = Hash::make($request->password);
            }

            $user->update($updateData);

            // Handle single role assignment
            if ($request->has('role')) {
                if ($request->role) {
                    $user->syncRoles([$request->role]);
                } else {
                    $user->syncRoles([]);
                }
            }

            return redirect()->route('users.index')
                ->with('success', 'User updated successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to update user. Please try again.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user): RedirectResponse
    {
        try {
            // Prevent deletion of current user
            if ($user->id === auth()->id()) {
                return redirect()->back()
                    ->with('error', 'You cannot delete your own account.');
            }

            // Prevent deletion of admin users (optional)
            if ($user->hasRole('admin')) {
                return redirect()->back()
                    ->with('error', 'Admin users cannot be deleted.');
            }

            $user->delete();

            return redirect()->route('users.index')
                ->with('success', 'User deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to delete user. Please try again.');
        }
    }
}