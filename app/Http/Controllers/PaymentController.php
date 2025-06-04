<?php

namespace App\Http\Controllers;

use App\Models\Bill;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index()
    {
        return Inertia::render('payments/index', [
            'bills' => Bill::with('financial_period', 'member')->where('status', 'unpaid')->get(),
        ]);
    }
}
