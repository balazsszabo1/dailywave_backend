const express = require('express');
const authenticateToken = require('../middleware/jwtAuth');
const { uploadNews, getAllNews, getAllNewsByID, searchNews, newsLetter } = require('../controllers/newsControllers');

const router = express.Router();

// Hír feltöltése (csak hitelesített felhasználóknak)
router.post('/uploadNews', uploadNews);


// Hírek lekérése (nyilvános vagy hitelesítéssel)
router.get('/getAllNews', getAllNews);  // Ha nem kell hitelesítés a lekéréshez

// Hír lekérése ID alapján
router.get('/getNewsById', getAllNewsByID);

router.get('/search', searchNews);

router.post('/newsletter', newsLetter);

module.exports = router;
