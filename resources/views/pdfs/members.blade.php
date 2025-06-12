<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Company Report</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #fff;
      padding: 40px;
      color: #333;
      font-size: 14px;
    }

    .text-center {
      text-align: center;
      margin-bottom: 30px;
    }

    h1 {
      font-size: 24px;
      font-weight: bold;
    }

    .subtext {
      color: #666;
      font-size: 13px;
      margin-top: 5px;
    }

    .report-title {
      font-size: 18px;
      font-weight: 500;
      margin-top: 10px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    thead {
      background-color: #f5f5f5;
    }

    th, td {
      border: 1px solid #ccc;
      padding: 8px;
      text-align: left;
    }

    th {
      font-weight: bold;
    }

    tbody tr:nth-child(even) {
      background-color: #fafafa;
    }
  </style>
</head>
<body>

  <!-- Header -->
  <div class="text-center">
    <h1>Housing Cooperative</h1>
    <p class="subtext">{{ $date }}</p>
    <p class="report-title">Consolidated Members Report</p>
  </div>

  <!-- Report Table -->
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Status</th>
        <th>Joining Date</th>
        <th>Total Contribution</th>
      </tr>
    </thead>
    <tbody>
      @foreach($members as $item)
      <tr>
        <td>{{ $loop->iteration }}</td>
        <td>{{ $item->full_name }}</td>
        <td>{{ $item->status }}</td>
        <td>{{ $item->joining_date }}</td>
        <td>{{ $item->total_contribution }}</td>
      </tr>
      @endforeach
    </tbody>
  </table>

</body>
</html>
