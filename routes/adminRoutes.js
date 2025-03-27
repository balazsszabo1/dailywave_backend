const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const isAdmin = require('../middlewares/isAdmin');

router.get('/admin-only', authenticateToken, isAdmin, (req, res) => {
    res.json({ message: 'Üdvözöllek, Admin!' });
});

module.exports = router;
