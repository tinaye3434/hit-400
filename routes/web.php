<?php

use Inertia\Inertia;
use App\Models\Member;
use App\Http\Controllers\Billing;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StandController;
use App\Http\Controllers\LedgerController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\BillingController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\WithdrawalController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

// Route::get('/', function () {
//     return Inertia::render('welcome');
// })->name('home');

Route::get('/', [AuthenticatedSessionController::class, 'create'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

//    Route::get('members', function () {
//        return Inertia::render('members/index', [
//            'members' => Member::all(),
//        ]);
//    })->name('members');

    Route::resource('members', MemberController::class);
    Route::post('member-status/{member}', [MemberController::class, 'statusChange'])->name('members.status');

    //Billing
    Route::get('billing', [BillingController::class, 'index'])->name('billing.index');
    Route::post('billing', [BillingController::class, 'store'])->name('billing.store');

    //Payment
    Route::get('payments', [PaymentController::class, 'index'])->name('payments.index');
    Route::post('payment/{bill}', [PaymentController::class, 'store'])->name('payments.store');

    //Withdrawal
    Route::get('withdrawals', [WithdrawalController::class, 'index'])->name('withdrawal.index');
    Route::post('withdrawals', [WithdrawalController::class, 'store'])->name('withdrawal.store');

    //Ledger
    Route::get('ledger', [LedgerController::class, 'index'])->name('ledger.index');

    //Stands
    Route::get('stands', [StandController::class, 'index'])->name('stands.index');

    //Reports
    Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('reports/{type}', [ReportController::class, 'store']);


});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
