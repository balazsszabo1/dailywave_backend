const express = require('express');
const authenticateToken = require('../middleware/jwtAuth');
const { register, login, logout } = require('../controllers/authControllers');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticateToken, logout);

module.exports = router;