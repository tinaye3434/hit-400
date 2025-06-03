<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class FinancialPeriodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $year = now()->year;

        for ($month = 1; $month <= 12; $month++) {
            $startDate = Carbon::create($year, $month, 1);
            $endDate = $startDate->copy()->endOfMonth();

            DB::table('financial_periods')->insert([
                'name' => $startDate->format('F Y'), // e.g. "January 2025"
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
