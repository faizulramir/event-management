<?php

namespace App\Http\Requests\Users;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization will be handled by middleware/policies
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'role' => ['nullable', 'string', 'exists:roles,name'],
        ];

        // For creation, password is required
        if ($this->isMethod('POST')) {
            $rules['email'][] = 'unique:users';
            $rules['password'] = ['required', 'string', 'min:8', 'confirmed'];
        }

        // For updates, password is optional and email uniqueness excludes current user
        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $user = $this->route('user');
            if ($user) {
                $rules['email'][] = 'unique:users,email,' . $user->uuid . ',uuid';
            }
            $rules['password'] = ['nullable', 'string', 'min:8', 'confirmed'];
        }

        return $rules;
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => "The user name is required.",
            'name.string' => "The user name must be a string.",
            'name.max' => "The user name must not be greater than 255 characters.",
            'email.required' => "The user email is required.",
            'email.email' => "The user email must be a valid email address.",
            'email.unique' => "The user email must be unique.",
            'password.required' => "The user password is required.",
            'password.min' => "The user password must be at least 8 characters.",
            'password.confirmed' => "The user password confirmation must match.",
            'role.exists' => "The user role must exist.",
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Remove empty password fields for updates
        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            if (empty($this->password)) {
                $this->request->remove('password');
                $this->request->remove('password_confirmation');
            }
        }

        // Convert empty role to null
        if ($this->role === '') {
            $this->merge(['role' => null]);
        }
    }
}