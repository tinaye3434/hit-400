<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class LedgerController extends Controller
{
    public function index()
    {
        return Inertia::render('ledger/index');
    }
}
