
const db = require('../models/db');

const uploadNews = (req, res) => {
    const { cat_id, news_title, news } = req.body;
    const index_pic = req.file ? req.file.filename : null; // Feltöltött fájl neve

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

const getAllNews = (req, res) => {
    const sql = "SELECT cat_id, news_title, news, index_pic FROM news";

    db.query(sql, (error, results) => {
        if (error) {
            console.error("Hiba a hírek lekérése során:", error);
            return res.status(500).json({ error: "Hiba történt a hírek lekérése közben" });
        }
        res.json(results);
    });
};

module.exports = { uploadNews, getAllNews }