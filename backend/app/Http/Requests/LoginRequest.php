<?php

namespace App\Http\Requests;

class LoginRequest extends BaseApiRequest
{
    public function rules(): array
    {
        return [
            'login' => ['required', 'string'],
            'password' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'login.required' => 'Email/username wajib diisi.',
            'password.required' => 'Password wajib diisi.',
        ];
    }
}
