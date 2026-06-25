<?php

namespace App\Http\Requests;

class TopupRequest extends BaseApiRequest
{
    public const MAX_AMOUNT = 50_000_000;

    public function rules(): array
    {
        return [
            'amount' => [
                'required',
                'integer',
                'min:1',
                'max:' . self::MAX_AMOUNT,
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'amount.required' => 'Nominal tidak boleh kosong.',
            'amount.integer' => 'Nominal harus berupa angka.',
            'amount.min' => 'Nominal harus lebih besar dari 0.',
            'amount.max' => 'Nominal melebihi batas maksimum transaksi.',
        ];
    }
}
