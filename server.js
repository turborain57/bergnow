const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/weather/:location', async (req, res) => {
  try {
    const { location } = req.params;
    const weatherData = await fetchWeatherData(location);
    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/avalanche-alerts/:region', async (req, res) => {
  try {
    const { region } = req.params;
    const alerts = await fetchAvalancheAlerts(region);
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/trails/:region', async (req, res) => {
  try {
    const { region } = req.params;
    const trails = await getTrailConditions(region);
    res.json(trails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// WebSocket for real-time alerts
wss.on('connection', (ws) => {
  console.log('Client connected');
  
  ws.on('message', async (message) => {
    const data = JSON.parse(message);
    if (data.type === 'subscribe') {
      // Subscribe to region alerts
      subscribeToAlerts(ws, data.region);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Helper functions
async function fetchWeatherData(location) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`
  );
  return response.json();
}

async function fetchAvalancheAlerts(region) {
  // Mock data - replace with actual USGS API
  return {
    region,
    alerts: [],
    lastUpdated: new Date(),
  };
}

async function getTrailConditions(region) {
  // Mock data - replace with actual trail API
  return {
    region,
    trails: [],
  };
}

function subscribeToAlerts(ws, region) {
  // Implement alert subscription logic
  setInterval(() => {
    const alert = {
      type: 'alert',
      region,
      message: 'High avalanche risk',
      timestamp: new Date(),
    };
    ws.send(JSON.stringify(alert));
  }, 60000); // Check every minute
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
