const express = require('express');
const axios = require('axios');
const cors = require('cors');

// Router'lar
const authRouter = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Servis adresleri
const SERVICES = {
  jobPosting: 'http://localhost:4001',
  jobSearch: 'http://localhost:4002',
  notification: 'http://localhost:4003',
  aiAgent: 'http://localhost:4004'
};

// Auth router
app.use('/auth', authRouter);

// Proxy helper fonksiyonu
function proxyTo(serviceUrl) {
  return async (req, res) => {
    try {
      const url = serviceUrl + req.originalUrl;
      const response = await axios({
        method: req.method,
        url,
        data: req.body,
        headers: req.headers
      });
      res.status(response.status).json(response.data);
    } catch (e) {
      res.status(e.response?.status || 500).json(e.response?.data || { error: 'Gateway error' });
    }
  };
}

// Yönlendirme/proxy endpointleri
app.use('/jobs', proxyTo(SERVICES.jobPosting));
app.use('/search', proxyTo(SERVICES.jobSearch));
app.use('/notifications', proxyTo(SERVICES.notification));
app.use('/ai-agent', proxyTo(SERVICES.aiAgent));

// Frontend'in beklediği ek endpointler (notification-service üzerinden)
app.use('/search-history', proxyTo(SERVICES.notification));
app.use('/alerts', proxyTo(SERVICES.notification));

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

module.exports = app;
