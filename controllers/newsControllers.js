
const db = require('../models/db');

const uploadNews = (req, res) => {
    const { cat_id, news_title, news, index_pic } = req.body;

    if (!cat_id || !news_title || !news || !index_pic) {
        return res.status(400).json({ error: 'Minden mező kitöltése kötelező' });
    }

    const query = 'INSERT INTO news (cat_id, news_title, news, index_pic) VALUES (?, ?, ?, ?)';
    db.query(query, [cat_id, news_title, news, index_pic], (err, result) => {
        if (err) {
            console.error('Database insert error:', err);
            return res.status(500).json({ error: 'Hiba történt az adatbázis művelet során' });
        }
        res.status(201).json({ message: 'Hír sikeresen feltöltve', news_id: result.insertId });
    });
};

module.exports = {uploadNews}