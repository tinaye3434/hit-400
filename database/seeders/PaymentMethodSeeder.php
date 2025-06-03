<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class PaymentMethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $methods = [
            'Ecocash',
            'OneMoney',
            'Telecash',
            'ZIPIT',
            'Bank Transfer',
            'Swipe (POS)',
            'Cash',
            'NMB Mobile',
            'CBZ Touch',
            'RTGS',
            'USD Cash',
            'Mukuru',
        ];

        foreach ($methods as $method) {
            DB::table('payment_methods')->insert([
                'name' => $method,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
