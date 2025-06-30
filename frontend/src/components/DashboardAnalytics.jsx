import { PieChart, Pie, Cell, Tooltip as ReTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { useMemo } from 'react';

const STATUS_COLORS = {
  active: '#43b581',
  inactive: '#ffb300',
  failed: '#f44336',
};

// Mock issue data (in real app, this should come from device.issue or similar)
const ISSUE_LABELS = [
  'Power supply issue',
  'Sensor error',
  'Network failure',
  'Calibration needed',
  'Unknown',
];

function getRandomIssue() {
  return ISSUE_LABELS[Math.floor(Math.random() * ISSUE_LABELS.length)];
}

// Mock maintenance data (in real app, use device.maintenanceDue or similar)
function getRandomMaintenanceDate() {
  const now = new Date();
  const days = Math.floor(Math.random() * 60) - 10; // -10 to +50 days from now
  const d = new Date(now);
  d.setDate(now.getDate() + days);
  return d;
}

const DashboardAnalytics = ({ devices }) => {
  // Pie chart: working vs failed
  const statusData = useMemo(() => {
    const active = devices.filter(d => d.status === 'active').length;
    const inactive = devices.filter(d => d.status === 'inactive').length;
    const failed = devices.filter(d => d.status === 'failed').length;
    return [
      { name: 'Active', value: active, color: STATUS_COLORS.active },
      { name: 'Inactive', value: inactive, color: STATUS_COLORS.inactive },
      { name: 'Failed', value: failed, color: STATUS_COLORS.failed },
    ];
  }, [devices]);

  // Bar chart: most common issues (mocked)
  const issueCounts = useMemo(() => {
    // In real app, use device.issue or device.errorType
    const issues = devices.map(d => d.status === 'failed' ? getRandomIssue() : null).filter(Boolean);
    const counts = {};
    for (const issue of issues) {
      counts[issue] = (counts[issue] || 0) + 1;
    }
    return ISSUE_LABELS.map(label => ({ issue: label, count: counts[label] || 0 }));
  }, [devices]);

  // Devices nearing maintenance (mocked)
  const maintenanceList = useMemo(() => {
    // In real app, use device.maintenanceDue
    return devices.map(d => ({
      name: d.name,
      due: getRandomMaintenanceDate(),
    })).filter(d => {
      const now = new Date();
      const days = (d.due - now) / (1000 * 60 * 60 * 24);
      return days >= 0 && days <= 14; // due in next 2 weeks
    }).sort((a, b) => a.due - b.due);
  }, [devices]);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, margin: '32px 0' }}>
      {/* Pie Chart: Status */}
      <div style={{ flex: '1 1 260px', minWidth: 260, background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(80,130,255,0.07)' }}>
        <h4 style={{ marginBottom: 16 }}>Device Status</h4>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
              {statusData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend />
            <ReTooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Bar Chart: Issues */}
      <div style={{ flex: '1 1 320px', minWidth: 320, background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(80,130,255,0.07)' }}>
        <h4 style={{ marginBottom: 16 }}>Most Common Issues (Mocked)</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={issueCounts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="issue" fontSize={12} />
            <YAxis allowDecimals={false} />
            <Bar dataKey="count" fill="#f44336" radius={[6, 6, 0, 0]} />
            <ReTooltip />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Devices Nearing Maintenance */}
      <div style={{ flex: '1 1 260px', minWidth: 260, background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(80,130,255,0.07)' }}>
        <h4 style={{ marginBottom: 16 }}>Devices Nearing Maintenance (Mocked)</h4>
        {maintenanceList.length === 0 ? (
          <div style={{ color: '#888' }}>No devices due for maintenance soon.</div>
        ) : (
          <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
            {maintenanceList.map((d, idx) => (
              <li key={idx} style={{ marginBottom: 10, fontSize: 15 }}>
                <span style={{ marginRight: 8 }}>🛠️</span>
                {d.name} <span style={{ color: '#888', fontSize: 13 }}>({d.due.toLocaleDateString()})</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DashboardAnalytics; 