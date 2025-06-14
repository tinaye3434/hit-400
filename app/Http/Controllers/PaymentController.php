<?php

namespace App\Http\Controllers;

use App\Models\Bill;
use App\Models\PaymentMethod;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index()
    {
        return Inertia::render('payments/index', [
            'bills' => Bill::with('financial_period', 'member')->where('status', 'pending')->get(),
            'payment_methods' => PaymentMethod::all(),
        ]);
    }

    public function store(Bill $bill, Request $request)
    {
        // dd($request);

        try{
            Payment::create([
                'bill_id' => $bill->id,
                'payment_method_id' => $request->payment_method_id,
                'amount_paid' => $request->amount
            ]);

            
            $bill->member->increment('total_contribution', $request->amount);

            if ($bill->payments->sum('amount_paid') >= $bill->amount)
            {
                $bill->update([
                    'status' => 'paid'
                ]);
            }

            $bill->billing->increment('paid_amount', $request->amount);

            return redirect()->route('payments.index')->with('success', 'Payment updated successfully.');

        } catch(\Exception $e) {
            dd($e);
        }
    }
}
