const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Upload könyvtár beállítása
const uploadDir = path.join(__dirname, 'uploads'); // Biztos, hogy a megfelelő könyvtárban van

// Multer beállítások
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Aszinkron mappa létrehozás
        fs.promises.mkdir(uploadDir, { recursive: true })
            .then(() => cb(null, uploadDir))
            .catch(err => cb(err));
    },
    filename: function (req, file, cb) {
        const now = new Date().toISOString().split('T')[0];
        // Ha a req.user.id nincs beállítva, generálj egy random ID-t vagy hagyd el
        const userId = req.user && req.user.id ? req.user.id : 'default';
        cb(null, `${userId}-${now}-${file.originalname}`);
    }
});

// Multer konfiguráció
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
    fileFilter: function (req, file, cb) {
        // Ellenőrizze a fájl kiterjesztését
        const filetypes = /jpeg|jpg|png|gif|webp|avif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Csak képformátumok megengedettek')); // Hiba, ha nem kép
        }
    }
});

// Exportálás
module.exports = upload;
