const express = require('express');
const authenticateToken = require('../middleware/jwtAuth');
const { uploadNews, getAllNews } = require('../controllers/newsControllers');

const router = express.Router();

// Hír feltöltése (csak hitelesített felhasználóknak)
router.post('/uploadNews', uploadNews);


// Hírek lekérése (nyilvános vagy hitelesítéssel)
router.get('/getAllNews', getAllNews);  // Ha nem kell hitelesítés a lekéréshez

// Hír lekérése ID alapján
router.get('/getNewsById', getNewsById);

module.exports = router;
