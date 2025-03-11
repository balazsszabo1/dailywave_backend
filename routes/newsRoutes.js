const express = require('express');
const authenticateToken = require('../middleware/jwtAuth');
const { uploadNews } = require('../controllers/newsControllers')

const router = express.Router();

router.post('/uploadnews', authenticateToken, uploadNews);