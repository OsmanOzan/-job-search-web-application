const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));

// Rate limit: Her IP için 15 dakikada 100 istek
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Çok fazla istek! Lütfen daha sonra tekrar deneyin.'
});
app.use(limiter);

// Servis adresleri (örnek)
const SERVICES = {
  jobPosting: 'http://localhost:4001',
  jobSearch: 'http://localhost:4002',
  notification: 'http://localhost:4003',
  aiAgent: 'http://localhost:4004'
};

// Job Posting Service'e yönlendirme
app.use('/jobs', (req, res) => {
  const url = SERVICES.jobPosting + req.originalUrl;
  axios({ method: req.method, url, data: req.body, headers: req.headers })
    .then(r => res.status(r.status).json(r.data))
    .catch(e => res.status(e.response?.status || 500).json(e.response?.data || { error: 'Gateway error' }));
});

// Job Search Service'e yönlendirme
app.use('/search', (req, res) => {
  const url = SERVICES.jobSearch + req.originalUrl;
  axios({ method: req.method, url, data: req.body, headers: req.headers })
    .then(r => res.status(r.status).json(r.data))
    .catch(e => res.status(e.response?.status || 500).json(e.response?.data || { error: 'Gateway error' }));
});

// Notification Service'e yönlendirme
app.use('/notifications', (req, res) => {
  const url = SERVICES.notification + req.originalUrl;
  axios({ method: req.method, url, data: req.body, headers: req.headers })
    .then(r => res.status(r.status).json(r.data))
    .catch(e => res.status(e.response?.status || 500).json(e.response?.data || { error: 'Gateway error' }));
});

// AI Agent Service'e yönlendirme
app.use('/ai-agent', (req, res) => {
  const url = SERVICES.aiAgent + req.originalUrl;
  axios({ method: req.method, url, data: req.body, headers: req.headers })
    .then(r => res.status(r.status).json(r.data))
    .catch(e => res.status(e.response?.status || 500).json(e.response?.data || { error: 'Gateway error' }));
});

app.listen(3001, () => console.log('API Gateway running on port 3001'));  