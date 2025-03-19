const db = require('../models/db');
const upload = require('../middleware/multer');  // A multer konfiguráció importálása

// Hír feltöltés és képfeltöltés
const uploadNews = (req, res) => {
    // A Multer middleware használata a fájl feltöltésére
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: 'Hiba történt a fájl feltöltésekor: ' + err.message });
        }

        const { cat_id, news_title, news } = req.body;
        const index_pic = req.file ? req.file.filename : null;

        // Minden mező validálása
        if (!cat_id || !news_title || !news || !index_pic) {
            return res.status(400).json({ error: 'Minden mező kitöltése kötelező.' });
        }

        // Kategória validálás (pl. legyen egy lista, amit a backend biztosít)
        const validCategories = ['magyarorszag', 'hirek', 'sport', 'politika'];  // példa
        if (!validCategories.includes(cat_id)) {
            return res.status(400).json({ error: 'Érvénytelen kategória.' });
        }

        // A hír és a kép mentése az adatbázisba
        const query = 'INSERT INTO news (cat_id, news_title, news, index_pic) VALUES (?, ?, ?, ?)';
        db.query(query, [cat_id, news_title, news, index_pic], (err, result) => {
            if (err) {
                console.error('Database insert error:', err);
                return res.status(500).json({ error: 'Hiba történt az adatbázis művelet során.' });
            }
            res.status(201).json({ message: 'Hír sikeresen feltöltve.', news_id: result.insertId });
        });
    });
};

// Hírek lekérése
const getAllNews = (req, res) => {
    const sql = "SELECT cat_id, news_title, news, index_pic FROM news";

    db.query(sql, (error, results) => {
        if (error) {
            console.error("Hiba a hírek lekérése során:", error);
            return res.status(500).json({ error: "Hiba történt a hírek lekérése közben." });
        }
        res.json(results);
    });
};

module.exports = { uploadNews, getAllNews };
