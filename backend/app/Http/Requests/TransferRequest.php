<?php

namespace App\Http\Requests;

class TransferRequest extends BaseApiRequest
{
    public const MAX_AMOUNT = 50_000_000;

    public function rules(): array
    {
        return [
            'target' => ['required', 'string', 'max:255'],
            'amount' => [
                'required',
                'integer',
                'min:1',
                'max:' . self::MAX_AMOUNT,
            ],
            'description' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'target.required' => 'Email/nomor HP penerima wajib diisi.',
            'amount.required' => 'Nominal tidak boleh kosong.',
            'amount.integer' => 'Nominal harus berupa angka.',
            'amount.min' => 'Nominal harus lebih besar dari 0.',
            'amount.max' => 'Nominal melebihi batas maksimum transaksi.',
        ];
    }
}
