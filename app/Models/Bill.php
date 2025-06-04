<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bill extends Model
{
    protected $guarded = ['id', 'created_at', 'updated_at'];

    public function member() {
        return $this->belongsTo(Member::class);
    }

    public function billing() {
        return $this->belongsTo(Billing::class);
    }

    public function financial_period() {
        return $this->belongsTo(FinancialPeriod::class);
    }
}
