<h2>Hello {{ $member->name }},</h2>

<p>Your bill for {{ $bill->financialPeriod->name }} has been generated.</p>

<ul>
    <li>Amount Due: <strong>${{ number_format($bill->amount, 2) }}</strong></li>
    {{-- <li>Due Date: {{ \Carbon\Carbon::parse($bill->create)->toFormattedDateString() }}</li> --}}
</ul>

<p>Please make your payment before the due date to avoid penalties.</p>

<p>Thank you,<br>The Cooperative Admin Team</p>