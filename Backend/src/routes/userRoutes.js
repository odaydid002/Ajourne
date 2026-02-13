const express = require('express');
const router = express.Router();

// Legacy user routes - can be expanded as needed
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'User routes are available',
    note: 'Use /api/v1/publishers for the new publisher management system'
  });
});

module.exports = router;
