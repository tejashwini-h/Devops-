import { SessionData } from "@/hooks/useSessionTracking";

export const exportToCSV = (sessions: SessionData[]) => {
  const headers = [
    "Session ID",
    "Start Time",
    "End Time",
    "Duration (min)",
    "Blink Count",
    "Avg Blink Rate",
    "Focus Score",
    "Eye Strain Level",
    "Gaze Away Count",
    "Fatigue Detections",
  ];

  const rows = sessions.map(session => [
    session.id,
    session.startTime.toLocaleString(),
    session.endTime?.toLocaleString() || "Ongoing",
    (session.duration / 60).toFixed(2),
    session.blinkCount,
    session.avgBlinkRate,
    session.focusScore,
    session.eyeStrainLevel,
    session.gazeAwayCount,
    session.fatigueDetections,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `neurolens_sessions_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (sessions: SessionData[]) => {
  // Create a simple HTML report that can be printed as PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>NeuroLens Session Report</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; background: #0a0a0a; color: #fff; }
        h1 { color: #00d9ff; text-align: center; margin-bottom: 30px; }
        .summary { background: #1a1a1a; padding: 20px; border-radius: 10px; margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; background: #1a1a1a; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #333; }
        th { background: #00d9ff; color: #000; font-weight: bold; }
        .metric { display: inline-block; margin: 10px 20px; }
        .metric-label { color: #888; font-size: 12px; }
        .metric-value { color: #00d9ff; font-size: 24px; font-weight: bold; }
      </style>
    </head>
    <body>
      <h1>NeuroLens Session Report</h1>
      <div class="summary">
        <h2>Overview</h2>
        <div class="metric">
          <div class="metric-label">Total Sessions</div>
          <div class="metric-value">${sessions.length}</div>
        </div>
        <div class="metric">
          <div class="metric-label">Avg Focus Score</div>
          <div class="metric-value">${(sessions.reduce((acc, s) => acc + s.focusScore, 0) / sessions.length).toFixed(1)}</div>
        </div>
        <div class="metric">
          <div class="metric-label">Total Time (hrs)</div>
          <div class="metric-value">${(sessions.reduce((acc, s) => acc + s.duration, 0) / 3600).toFixed(1)}</div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Duration</th>
            <th>Blink Rate</th>
            <th>Focus Score</th>
            <th>Eye Strain</th>
          </tr>
        </thead>
        <tbody>
          ${sessions.map(s => `
            <tr>
              <td>${new Date(s.startTime).toLocaleDateString()}</td>
              <td>${Math.floor(s.duration / 60)}m ${s.duration % 60}s</td>
              <td>${s.avgBlinkRate}/min</td>
              <td>${s.focusScore}%</td>
              <td>${s.eyeStrainLevel}/10</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <script>
        window.onload = () => window.print();
      </script>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }
};
