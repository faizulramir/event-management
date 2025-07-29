<?php

namespace App\Http\Requests\Roles;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRoleRequest extends FormRequest
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
        $roleId = $this->route('role')?->id;

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9\-_]+$/', // Only lowercase letters, numbers, hyphens, and underscores
                Rule::unique('roles', 'name')->ignore($roleId),
            ],
            'permissions' => [
                'nullable',
                'array',
            ],
            'permissions.*' => [
                'exists:permissions,name',
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => __('messages.role_name_required'),
            'name.unique' => __('messages.role_name_unique'),
            'name.regex' => __('messages.role_name_format'),
            'permissions.array' => __('messages.permissions_array'),
            'permissions.*.exists' => __('messages.permissions_invalid'),
        ];
    }
}
