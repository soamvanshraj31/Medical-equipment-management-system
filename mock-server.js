const http = require('http');
const url = require('url');
const WebSocket = require('ws');

// Mock data
const mockDevices = [
  {
    id: "dev-001",
    name: "ECG Machine",
    department: "Cardiology",
    status: "active",
    last_maintenance: "2024-01-15T00:00:00Z",
    next_maintenance: "2024-03-15T00:00:00Z",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z"
  },
  {
    id: "dev-002",
    name: "X-Ray Machine",
    department: "Radiology",
    status: "maintenance",
    last_maintenance: "2024-01-10T00:00:00Z",
    next_maintenance: "2024-02-10T00:00:00Z",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-20T00:00:00Z"
  },
  {
    id: "dev-003",
    name: "Ventilator",
    department: "ICU",
    status: "active",
    last_maintenance: "2024-01-05T00:00:00Z",
    next_maintenance: "2024-04-05T00:00:00Z",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-05T00:00:00Z"
  },
  {
    id: "dev-004",
    name: "Blood Analyzer",
    department: "Laboratory",
    status: "offline",
    last_maintenance: "2024-01-01T00:00:00Z",
    next_maintenance: "2024-02-01T00:00:00Z",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-25T00:00:00Z"
  },
  {
    id: "dev-005",
    name: "Surgical Robot",
    department: "Theatre",
    status: "active",
    last_maintenance: "2024-01-12T00:00:00Z",
    next_maintenance: "2024-05-12T00:00:00Z",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-12T00:00:00Z"
  }
];

const mockAnalytics = {
  predictive: {
    devices_needing_maintenance: 2,
    predicted_failures: 1,
    maintenance_schedule: [
      { device_id: "dev-001", next_maintenance: "2024-03-15T00:00:00Z" },
      { device_id: "dev-002", next_maintenance: "2024-02-10T00:00:00Z" }
    ],
    accuracy: 95.5
  },
  utilization: {
    total_devices: 5,
    active_devices: 3,
    maintenance_devices: 1,
    offline_devices: 1,
    utilization_rate: 60.0
  }
};

const departments = [
  "Biomedical Engineering",
  "Laboratory",
  "Theatre",
  "ICU",
  "Pathology",
  "Radiology",
  "Cardiology"
];

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  res.setHeader('Content-Type', 'application/json');

  // API Routes
  if (path === '/api/devices' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify(mockDevices));
  }
  else if (path === '/api/analytics/predictive' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify(mockAnalytics.predictive));
  }
  else if (path === '/api/analytics/utilization' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify(mockAnalytics.utilization));
  }
  else if (path === '/api/departments' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify(departments));
  }
  else if (path.startsWith('/api/devices/') && req.method === 'PUT') {
    // Mock device update
    const deviceId = path.split('/')[3];
    const device = mockDevices.find(d => d.id === deviceId);
    if (device) {
      res.writeHead(200);
      res.end(JSON.stringify(device));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Device not found' }));
    }
  }
  else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

// --- WebSocket server for /ws/devices ---
const wss = new WebSocket.Server({ server, path: '/ws/devices' });
wss.on('connection', function connection(ws) {
  // Send initial data
  ws.send(JSON.stringify({ type: 'initial_data', data: mockDevices }));
  // Keep connection open, respond to pings
  ws.on('message', function incoming(message) {
    // Optionally handle messages from client
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`🚀 Mock API server running on http://localhost:${PORT}`);
  console.log(`📊 Available endpoints:`);
  console.log(`   GET /api/devices`);
  console.log(`   GET /api/analytics/predictive`);
  console.log(`   GET /api/analytics/utilization`);
  console.log(`   GET /api/departments`);
  console.log(`   PUT /api/devices/:id`);
  console.log(`   WS  /ws/devices`);
}); 