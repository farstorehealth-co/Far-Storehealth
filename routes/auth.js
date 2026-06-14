const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {
  res.json({ success: true, message: 'Store registered' });
});

router.get('/verify', (req, res) => {
  res.json({ registered: true });
});

module.exports = router;
