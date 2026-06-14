const express = require('express');
const router = express.Router();
const auditEngine = require('../services/auditEngine');

const auditDatabase = {};

router.post('/run', async (req, res) => {
  try {
    const { shop, accessToken } = req.body;
    if (!shop || !accessToken) {
      return res.status(400).json({ error: 'Missing shop domain or access token' });
    }
    const auditResult = await auditEngine.performAudit(shop, accessToken);
    if (!auditDatabase[shop]) {
      auditDatabase[shop] = [];
    }
    auditDatabase[shop].push(auditResult);
    res.json({ success: true, data: auditResult });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/latest', (req, res) => {
  try {
    const shop = req.query.shop;
    if (!shop) return res.status(400).json({ error: 'Missing shop parameter' });
    const audits = auditDatabase[shop] || [];
    if (audits.length === 0) return res.status(404).json({ error: 'No audits found' });
    res.json({ success: true, data: audits[audits.length - 1] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/test', async (req, res) => {
  try {
    const demoAudit = await auditEngine.performAudit('demo-store.myshopify.com', 'demo-token');
    res.json({ success: true, data: demoAudit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
