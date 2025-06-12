<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Member;
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
        if ($type !== 'member') {
            throw new \InvalidArgumentException("Unsupported report type: {$type}");
        }

        // Generate PDF
        $pdf = Pdf::loadView('pdfs.members', [
            'companyName' => config('app.name'),
            'date' => now()->format('F j, Y, g:i a'),
            'reportTitle' => 'Members Report', 
            'members' => Member::all()
        ]);

        // Create storage directory if needed
        $directory = 'private/reports';
        Storage::makeDirectory($directory);

        // Generate unique filename
        $filename = 'members_'.now()->format('Ymd_His').'.pdf';
        $storagePath = "{$directory}/{$filename}";

        // Save to storage (verify success)
        $saved = Storage::put($storagePath, $pdf->output());
        if (!$saved) {
            throw new \Exception("Failed to save PDF to storage");
        }

        // Get absolute path to the file
        $absolutePath = Storage::path($storagePath);

        // Debugging output (temporary)
        logger()->debug('PDF download attempt', [
            'storage_path' => $storagePath,
            'absolute_path' => $absolutePath,
            'file_exists' => file_exists($absolutePath),
            'file_size' => filesize($absolutePath)
        ]);

        // Force download with proper headers
        return response()->download($absolutePath, $filename, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
        ]);

    } catch (\Exception $e) {
        logger()->error("PDF download failed: " . $e->getMessage());
        return back()->with('error', 'Failed to download report: ' . $e->getMessage());
    }
}
}
