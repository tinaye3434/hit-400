<?php

namespace App\Http\Controllers;

use App\Models\Bill;
use Inertia\Inertia;
use App\Models\Member;
use App\Models\Billing;
use Illuminate\Http\Request;
use App\Mail\BillGeneratedMail;
use App\Models\FinancialPeriod;
use Illuminate\Support\Facades\Mail;

class BillingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('billing/index', [
            'billings' => Billing::all(),
            'financial_periods' => FinancialPeriod::all()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        dd($request->all());
        $billing = Billing::create([
            'financial_period_id' => $request->financial_period_id,
        ]);

        $members = Member::where('status', 'active')->get();
          
        $total_amount = 0;
        foreach ($members as $member) {
            $bill = Bill::create([
                'billing_id' => $billing->id,
                'member_id' => $member->id,
                'financial_period_id' => $request->financial_period_id,
                'amount' => $request->amount,
            ]);
            
            // Send email to the member
            if (!empty($member->email)) {
                Mail::to($member->email)->queue(new BillGeneratedMail($member, $bill));
            }

            $total_amount += $request->amount;
        }

        $billing->update([
            'total_amount' => $total_amount,
        ]);

        return redirect()->route('billing.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
