const express = require('express');
const authenticateToken = require('../middleware/jwtAuth');
const upload = require('../middleware/upload'); // Multer middleware
const { uploadNews } = require('../controllers/newsControllers');

const router = express.Router();

// Az upload middleware hozzáadása, hogy a fájl is átmenjen a kérésben
router.post('/uploadnews', authenticateToken, upload.single('index_pic'), uploadNews);

module.exports = router;
