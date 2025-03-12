const express = require('express');
const authenticateToken = require('../middleware/jwtAuth');
const upload = require('../middleware/multer');
const { uploadNews, getAllNews } = require('../controllers/newsControllers')

const router = express.Router();

router.post('/uploadnews', authenticateToken,upload.single('image'), uploadNews);
router.get('/getAllNews', authenticateToken, getAllNews);

module.exports = router;