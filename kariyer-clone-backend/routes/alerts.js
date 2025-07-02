const express = require('express');
const router = express.Router();

router.get('/my', (req, res) => {
  res.json([{ keywords: ["örnek"], city: "İstanbul" }]);
});

module.exports = router;