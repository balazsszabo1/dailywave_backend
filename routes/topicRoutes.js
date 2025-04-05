const express = require('express');
const authenticateToken = require('../middleware/jwtAuth');
// const upload = require('../middleware/multer'); // nem kell most
const { getAlltopics, getComments, addComment, uploadTopic } = require('../controllers/topicControllers');

const router = express.Router();

router.get('/getAlltopics', authenticateToken, getAlltopics);
router.post('/uploadTopic', authenticateToken, uploadTopic);
router.get('/getComments/:topicId', getComments);
router.post('/addComment', authenticateToken, addComment);

module.exports = router;
