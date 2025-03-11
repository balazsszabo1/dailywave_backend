const db = require('../models/db');

const uploadNews = (req, res) => {
    // Ha nincs fájl, akkor visszatérünk hibaüzenettel
    const { cat_id, news_title, news } = req.body;
    const index_pic = req.file ? req.file.filename : null; // Ha van fájl, akkor a fájl nevét tesszük el

    // Ellenőrizzük, hogy minden szükséges mező van-e
    if (!cat_id || !news_title || !news || !index_pic) {
        return res.status(400).json({ error: 'Minden mező kitöltése kötelező' });
    }

    // SQL query, amiben elmentjük az adatokat
    const query = 'INSERT INTO news (cat_id, news_title, news, index_pic) VALUES (?, ?, ?, ?)';
    db.query(query, [cat_id, news_title, news, index_pic], (err, result) => {
        if (err) {
            console.error('Database insert error:', err);
            return res.status(500).json({ error: 'Hiba történt az adatbázis művelet során' });
        }
        res.status(201).json({
            message: 'Hír sikeresen feltöltve',
            news_id: result.insertId,
            index_pic_url: `/uploads/${index_pic}` // A kép elérhetősége frontend oldalról
        });
    });
};

module.exports = { uploadNews };
