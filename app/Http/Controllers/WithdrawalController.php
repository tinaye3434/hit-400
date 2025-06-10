<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Withdrawal;
use Illuminate\Http\Request;

class WithdrawalController extends Controller
{
    public function index()
    {
        return Inertia::render('withdrawal/index', [
            'withdrawals' => Withdrawal::all(),
        ]);
    }

    public function store(Request $request)
    {
        try{
            Withdrawal::create([
                'amount' => $request->amount,
                'comment' => $request->comment,
                'status' => 'approved'
            ]);

            return redirect()->route('withdrawal.index')->with('success', 'Payment updated successfully.');

        } catch(\Exception $e) {
            dd($e);
        }
    }
}
