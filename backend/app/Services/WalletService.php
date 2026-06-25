<?php

namespace App\Services;

use App\Exceptions\InsufficientBalanceException;
use App\Exceptions\RecipientNotFoundException;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Throwable;

class WalletService
{
    /**
     * Add funds to a user's wallet.
     */
    public function topup(User $user, int $amount, ?string $description = null): Transaction
    {
        return DB::transaction(function () use ($user, $amount, $description) {
            $wallet = Wallet::where('user_id', $user->id)->lockForUpdate()->first();

            if (!$wallet) {
                $wallet = Wallet::create(['user_id' => $user->id, 'balance' => 0]);
                $wallet = Wallet::where('id', $wallet->id)->lockForUpdate()->first();
            }

            $balanceBefore = (float) $wallet->balance;
            $balanceAfter = $balanceBefore + $amount;

            $wallet->update(['balance' => $balanceAfter]);

            return Transaction::create([
                'user_id' => $user->id,
                'type' => 'topup',
                'amount' => $amount,
                'balance_before' => $balanceBefore,
                'balance_after' => $balanceAfter,
                'related_user_id' => null,
                'reference_code' => (string) Str::uuid(),
                'description' => $description ?? 'Top up saldo',
            ]);
        });
    }

    /**
     * Transfer funds from $sender to a recipient identified by email or phone.
     * Wrapped in a single DB transaction: if the credit side fails, the debit
     * side rolls back automatically (no partial state possible).
     *
     * @throws InsufficientBalanceException
     * @throws RecipientNotFoundException
     */
    public function transfer(User $sender, string $targetIdentifier, int $amount, ?string $description = null): array
    {
        return DB::transaction(function () use ($sender, $targetIdentifier, $amount, $description) {
            $recipient = User::where('email', $targetIdentifier)
                ->orWhere('phone', $targetIdentifier)
                ->first();

            if (!$recipient) {
                throw new RecipientNotFoundException();
            }

            if ($recipient->id === $sender->id) {
                throw new RecipientNotFoundException('Tidak bisa transfer ke diri sendiri.');
            }

            $ids = [$sender->id, $recipient->id];
            sort($ids);
            $wallets = Wallet::whereIn('user_id', $ids)->lockForUpdate()->get()->keyBy('user_id');

            $senderWallet = $wallets->get($sender->id) ?? Wallet::create(['user_id' => $sender->id, 'balance' => 0]);
            $recipientWallet = $wallets->get($recipient->id) ?? Wallet::create(['user_id' => $recipient->id, 'balance' => 0]);

            $senderBalanceBefore = (float) $senderWallet->balance;

            if ($senderBalanceBefore < $amount) {
                throw new InsufficientBalanceException();
            }

            $senderBalanceAfter = $senderBalanceBefore - $amount;
            $recipientBalanceBefore = (float) $recipientWallet->balance;
            $recipientBalanceAfter = $recipientBalanceBefore + $amount;

            $senderWallet->update(['balance' => $senderBalanceAfter]);
            $recipientWallet->update(['balance' => $recipientBalanceAfter]);

            $referenceCode = (string) Str::uuid();

            $outTransaction = Transaction::create([
                'user_id' => $sender->id,
                'type' => 'transfer_out',
                'amount' => $amount,
                'balance_before' => $senderBalanceBefore,
                'balance_after' => $senderBalanceAfter,
                'related_user_id' => $recipient->id,
                'reference_code' => $referenceCode,
                'description' => $description ?? 'Transfer ke ' . $recipient->name,
            ]);

            $inTransaction = Transaction::create([
                'user_id' => $recipient->id,
                'type' => 'transfer_in',
                'amount' => $amount,
                'balance_before' => $recipientBalanceBefore,
                'balance_after' => $recipientBalanceAfter,
                'related_user_id' => $sender->id,
                'reference_code' => $referenceCode,
                'description' => $description ?? 'Transfer dari ' . $sender->name,
            ]);

            return [
                'sender_transaction' => $outTransaction,
                'recipient_transaction' => $inTransaction,
            ];
        });
    }
}
