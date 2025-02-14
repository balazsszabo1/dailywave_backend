const express = require('express');
const authenticateToken = require('../middleware/jwtAuth');
const upload = require('../middleware/multer');
const { editProfileName, editProfilePsw, editProfilePic, getProfilePic, getProfileName } = require('../controllers/profileControllers.js');

const router = express.Router();

router.put('/editProfileName', authenticateToken, editProfileName);
router.put('/editProfilePsw', authenticateToken, editProfilePsw);
router.put('/editProfilePic', authenticateToken, upload.single('profilePic'), editProfilePic);
router.get('/getProfilePic', authenticateToken, getProfilePic);
router.get('/getProfileName', authenticateToken, getProfileName);

module.exports = router;