<?php

namespace App\Mail;

use App\Models\Member;
use App\Models\Bill;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BillGeneratedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $member;
    public $bill;

    public function __construct(Member $member, Bill $bill)
    {
        $this->member = $member;
        $this->bill = $bill;
    }

    public function build()
    {
        return $this->subject("Your Monthly Bill - {$this->bill->month}/{$this->bill->year}")
                    ->view('emails.bill');
    }
}
