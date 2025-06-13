<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Member;
use App\Models\Billing;
use App\Models\Withdrawal;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class ReportController extends Controller
{
    public function index()
    {
        return Inertia::render('reports/index');
    }

    public function store($type)
    {
        try {
            if ($type == 'member') {
                
                return Inertia::render('reports/member-report', [
                    'results' => Member::all(),
                    'date' => now()->format('F j, Y, g:i a'),
                ]);
            }

            if ($type == 'billing') {
                
                return Inertia::render('reports/billing-report', [
                    'results' => Billing::with('bills', 'financial_period')->get(),
                    'date' => now()->format('F j, Y, g:i a'),
                ]);
            }

            if ($type == 'withdrawal') {
                
                return Inertia::render('reports/withdrawal-report', [
                    'results' => Withdrawal::all(),
                    'date' => now()->format('F j, Y, g:i a'),
                ]);
            }
            
           

          

        } catch (\Exception $e) {
            logger()->error("Report download failed: " . $e->getMessage());
            return back()->with('error', 'Failed to download report.');
        }
    }

}
