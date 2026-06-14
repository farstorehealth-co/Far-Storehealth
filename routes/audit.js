const express = require('express');
const router = express.Router();
const auditEngine = require('../services/auditEngine');

// Handle both GET and POST for /test
router.get('/test', async (req, res) => {
  try {
    const auditResult = await auditEngine.performAudit('demo-store.myshopify.com', 'demo-token');
    res.json({ 
      success: true, 
      data: auditResult
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/test', async (req, res) => {
  try {
    const auditResult = await auditEngine.performAudit('demo-store.myshopify.com', 'demo-token');
    res.json({ 
      success: true, 
      data: auditResult
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/run', async (req, res) => {
  try {
    const { shop, accessToken } = req.body;
    if (!shop || !accessToken) {
      return res.status(400).json({ error: 'Missing shop or accessToken' });
    }
    const auditResult = await auditEngine.performAudit(shop, accessToken);
    res.json({ success: true, data: auditResult });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/latest', (req, res) => {
  res.json({ message: 'Get latest audit' });
});

module.exports = router;
