const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const auditRoutes = require('./routes/audit');
const authRoutes = require('./routes/auth');
const monitoringRoutes = require('./routes/monitoring');

app.use('/api/audits', auditRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/monitoring', monitoringRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date(),
    message: 'Store Health Audit API is running'
  });
});

app.get('/', (req, res) => {
  res.json({ 
    app: 'Store Health Audit',
    version: '1.0.0'
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: err.message || 'Internal server error',
    timestamp: new Date()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  Store Health Audit API                ║
║  Running on port ${PORT}                   ║
║  http://localhost:${PORT}                 ║
╚════════════════════════════════════════╝
  `);
});

module.exports = app;
