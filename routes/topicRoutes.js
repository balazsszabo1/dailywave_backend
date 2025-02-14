const express = require('express');
const authenticateToken = require('../middleware/jwtAuth');
const upload = require('../middleware/multer');
const { getAlltopics, getComments, addComment, uploadTopic } = require('../controllers/topicControllers');

const router = express.Router();

router.get('/getAlltopics', authenticateToken, getAlltopics);
router.post('/uploadTopic', upload.single('topic'), uploadTopic);
router.get('/getComments/:topicId', getComments);
router.post('/addComment', addComment);

module.exports = router;