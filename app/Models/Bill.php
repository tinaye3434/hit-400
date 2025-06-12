<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bill extends Model
{
    protected $guarded = ['id', 'created_at', 'updated_at'];
    protected $appends = ['balance'];

    public function member() {
        return $this->belongsTo(Member::class);
    }

    public function billing() {
        return $this->belongsTo(Billing::class);
    }

    public function financial_period() {
        return $this->belongsTo(FinancialPeriod::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function getBalanceAttribute()
    {
        return $this->amount - $this->payments()->sum('amount_paid');
    }
}
