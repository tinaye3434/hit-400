<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Billing extends Model
{
    protected $guarded = ['id', 'created_at', 'updated_at'];

    public function bills() {
        return $this->hasMany(Bill::class);
    }

    public function financial_period() {
        return $this->belongsTo(FinancialPeriod::class);
    }
}
