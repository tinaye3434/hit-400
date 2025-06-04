{{-- <h2>Hello {{ $member->name }},</h2>

<p>Your bill for {{ $bill->financialPeriod->name }} has been generated.</p>

<ul>
    <li>Amount Due: <strong>${{ number_format($bill->amount, 2) }}</strong></li>
    <li>Due Date: {{ \Carbon\Carbon::parse($bill->create)->toFormattedDateString() }}</li>
</ul>

<p>Please make your payment before the due date to avoid penalties.</p>

<p>Thank you,<br>The Cooperative Admin Team</p> --}}

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>January 2025 Bill</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      background-color: #f4f4f4;
      padding: 20px;
    }
    .container {
      background-color: #ffffff;
      padding: 30px;
      max-width: 600px;
      margin: auto;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .header {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 20px;
      color: #333333;
    }
    .content {
      font-size: 16px;
      color: #555555;
    }
    .highlight {
      font-weight: bold;
      color: #000000;
    }
    .footer {
      margin-top: 30px;
      font-size: 14px;
      color: #999999;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">Hello {{ $member->full_name }},</div>
    <div class="content">
      Your bill for <span class="highlight">{{ $bill->financial_period->name }}</span> has been generated.<br><br>
      <span class="highlight">Amount Due:</span> $100.00<br>
      <span class="highlight">Due Date: {{ \Carbon\Carbon::parse($bill->financial_period->end_date)->toFormattedDateString() }} </span>
    <br>
    <em>Please make your payment before the due date to avoid penalties.</em><br><br>
      Thank you for being a valued member of our cooperative.
    </div>
    <div class="footer">
      Sincerely,<br>
      The Cooperative Admin Team
    </div>
  </div>
</body>
</html>
