const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/jwtAuth');
const isAdmin = require('../middleware/isAdmin');

router.get('/admin-only', authenticateToken, isAdmin, (req, res) => {
    res.json({ role: req.user.role });
});

module.exports = router;
