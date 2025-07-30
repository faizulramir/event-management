<?php

namespace App\Http\Requests\Events;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEventRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'start_date' => ['required', 'date', 'after:now'],
            'end_date' => ['required', 'date', 'after:start_date'],
            'location' => ['nullable', 'string', 'max:255'],
            'max_attendees' => ['nullable', 'integer', 'min:1', 'max:10000'],
            'is_public' => ['boolean'],
            'status' => ['required', 'string', Rule::in(['draft', 'active', 'cancelled', 'completed'])],
        ];

        // For updates, allow start_date to be in the past if it's not being changed
        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $event = $this->route('event');
            if ($event && $this->start_date === $event->start_date->format('Y-m-d\TH:i')) {
                $rules['start_date'] = ['required', 'date'];
            }
        }

        return $rules;
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'title.required' => 'The event title is required.',
            'title.string' => 'The event title must be a string.',
            'title.max' => 'The event title must not be greater than 255 characters.',
            'description.string' => 'The event description must be a string.',
            'description.max' => 'The event description must not be greater than 5000 characters.',
            'start_date.required' => 'The event start date is required.',
            'start_date.date' => 'The event start date must be a valid date.',
            'start_date.after' => 'The event start date must be in the future.',
            'end_date.required' => 'The event end date is required.',
            'end_date.date' => 'The event end date must be a valid date.',
            'end_date.after' => 'The event end date must be after the start date.',
            'location.string' => 'The event location must be a string.',
            'location.max' => 'The event location must not be greater than 255 characters.',
            'max_attendees.integer' => 'The maximum attendees must be a number.',
            'max_attendees.min' => 'The maximum attendees must be at least 1.',
            'max_attendees.max' => 'The maximum attendees must not be greater than 10000.',
            'is_public.boolean' => 'The public field must be true or false.',
            'status.required' => 'The event status is required.',
            'status.in' => 'The event status must be one of: draft, active, cancelled, completed.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Convert empty strings to null
        if ($this->description === '') {
            $this->merge(['description' => null]);
        }

        if ($this->location === '') {
            $this->merge(['location' => null]);
        }

        if ($this->max_attendees === '') {
            $this->merge(['max_attendees' => null]);
        }

        // Ensure is_public is boolean
        if ($this->has('is_public')) {
            $this->merge(['is_public' => (bool) $this->is_public]);
        }
    }
}