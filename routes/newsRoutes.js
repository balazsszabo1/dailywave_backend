const express = require('express');
const authenticateToken = require('../middleware/jwtAuth');
const { uploadNews, getAllNews, getAllNewsByID, searchNews, newsLetter } = require('../controllers/newsControllers');

const router = express.Router();

router.post('/uploadNews', uploadNews);
router.get('/getAllNews', getAllNews);
router.get('/getNewsById', getAllNewsByID);
router.get('/search', searchNews);
router.post('/newsletter', newsLetter);

module.exports = router;