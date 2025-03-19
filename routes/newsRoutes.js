const express = require('express');
const authenticateToken = require('../middleware/jwtAuth');
const { uploadNews, getAllNews } = require('../controllers/newsControllers')

const router = express.Router();

router.post('/uploadnews', authenticateToken, uploadNews);
router.get('/getAllNews', authenticateToken, getAllNews);

module.exports = router;