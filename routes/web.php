<?php

use App\Http\Controllers\MemberController;
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
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
