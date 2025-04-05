const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '../uploads');

console.log('UPLOAD DIR:', uploadDir);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        fs.promises.mkdir(uploadDir, { recursive: true })
            .then(() => cb(null, uploadDir))
            .catch(err => cb(err));
    },
    filename: function (req, file, cb) {
        const now = new Date().toISOString().split('T')[0];

        const userId = req.user && req.user.id ? req.user.id : 'default';

        cb(null, `${userId}-${now}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif|webp|avif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Csak képformátumok engedélyezettek!'));
        }
    }
});

module.exports = upload;
