<?php

namespace App\Http\Requests\Permissions;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePermissionRequest extends FormRequest
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
        $permissionId = $this->route('permission')?->id;

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9\-_\.]+$/', // Only lowercase letters, numbers, hyphens, underscores, and dots
                Rule::unique('permissions', 'name')->ignore($permissionId),
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => __('messages.permission_name_required'),
            'name.unique' => __('messages.permission_name_unique'),
            'name.regex' => __('messages.permission_name_format'),
        ];
    }
}
