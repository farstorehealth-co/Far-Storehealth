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

app.use('/api/audits', auditRoutes);
app.use('/api/auth', authRoutes);

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});

module.exports = app;
