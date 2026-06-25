<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TopupRequest;
use App\Http\Requests\TransferRequest;
use App\Http\Resources\TransactionResource;
use App\Http\Resources\WalletResource;
use App\Models\Wallet;
use App\Services\WalletService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    public function __construct(private WalletService $walletService)
    {
    }

    public function show(Request $request): JsonResponse
    {
        $wallet = Wallet::firstOrCreate(
            ['user_id' => $request->user()->id],
            ['balance' => 0]
        );

        return response()->json([
            'success' => true,
            'message' => 'Saldo berhasil diambil.',
            'data' => new WalletResource($wallet),
        ]);
    }

    public function topup(TopupRequest $request): JsonResponse
    {
        $transaction = $this->walletService->topup(
            $request->user(),
            (int) $request->validated('amount'),
            $request->validated('description')
        );

        return response()->json([
            'success' => true,
            'message' => 'Top up berhasil.',
            'data' => new TransactionResource($transaction),
        ], 201);
    }

    public function transfer(TransferRequest $request): JsonResponse
    {
        $result = $this->walletService->transfer(
            $request->user(),
            $request->validated('target'),
            (int) $request->validated('amount'),
            $request->validated('description')
        );

        return response()->json([
            'success' => true,
            'message' => 'Transfer berhasil.',
            'data' => new TransactionResource($result['sender_transaction']),
        ], 201);
    }
}
