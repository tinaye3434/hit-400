<?php

use App\Http\Controllers\Billing;
use App\Http\Controllers\BillingController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\PaymentController;
use App\Models\Member;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

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
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
