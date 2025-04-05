const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Az uploads könyvtár elérési útja (a projekt gyökerében)
const uploadDir = path.join(__dirname, '../uploads');

// Debug log, hogy lásd pontosan hova próbál írni
console.log('UPLOAD DIR:', uploadDir);

// Multer storage beállítás
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Gondoskodunk arról, hogy a mappa létezzen (ha nincs, létrehozza)
        fs.promises.mkdir(uploadDir, { recursive: true })
            .then(() => cb(null, uploadDir))
            .catch(err => cb(err));
    },
    filename: function (req, file, cb) {
        const now = new Date().toISOString().split('T')[0];

        // Ha van user azonosító (JWT alapján), hozzárendeljük a fájl nevéhez, különben "default"
        const userId = req.user && req.user.id ? req.user.id : 'default';

        // A fájl neve: userId-dátum-eredetiFájlnév
        cb(null, `${userId}-${now}-${file.originalname}`);
    }
});

// Multer konfiguráció: méretlimit és fájltípus szűrés
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
    fileFilter: function (req, file, cb) {
        // Csak képeket engedélyezünk
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
