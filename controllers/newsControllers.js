const db = require('../models/db');
const upload = require('../middleware/multer');  // A multer konfiguráció importálása

// Hír feltöltés és képfeltöltés
const uploadNews = (req, res) => {
    // A Multer middleware használata a fájl feltöltésére
    upload.single('index_pic')(req, res, (err) => {  // Az "index_pic" az a mező, amelyet a Postman-ben beállítasz a fájlhoz
        if (err) {
            return res.status(400).json({ error: 'Hiba történt a fájl feltöltésekor: ' + err.message });
        }

        const { cat_id, news_title, news } = req.body;
        const index_pic = req.file ? req.file.filename : null;

        // Minden mező validálása
        if (!cat_id || !news_title || !news || !index_pic) {
            return res.status(400).json({ error: 'Minden mező kitöltése kötelező.' });
        }

        // Kategória validálás (csak a számokat engedélyezzük, 1, 2, 3, 4)
        const validCategories = [1, 2, 3, 4, 5];  // Az érvényes kategória ID-k
        if (!validCategories.includes(Number(cat_id))) {
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
    const sql = "SELECT * FROM news";

    db.query(sql, (error, results) => {
        if (error) {
            console.error("Hiba a hírek lekérése során:", error);
            return res.status(500).json({ error: "Hiba történt a hírek lekérése közben." });
        }
        res.json(results);
    });
};


// Hírek lekérése egyedileg az ID alapján
 const getAllNewsByID = (req, res) => {
    const { news_id } = req.query; // Az ID a query paraméterek között
    const query = 'SELECT * FROM news WHERE news_id = ?';
   console.log(news_id)
    
    db.query(query, [news_id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Hiba a hír lekérése során.' });
      }
      if (result.length === 0) {
        return res.status(404).json({ error: 'Hír nem található.' });
      }
      res.json(result[0]); // Az első találatot küldjük vissza
    });
  };
  


  const searchNews = (req, res) => {
    const { query } = req.query;  // A keresési kifejezés a query paraméterek között

    if (!query) {
        return res.status(400).json({ error: 'Keresési kifejezés szükséges' });
    }

    // SQL lekérdezés a news_title keresésére
    const sql = 'SELECT news_title FROM news WHERE news_title LIKE ?';
    
    db.query(sql, [`%${query}%`], (err, result) => {
        if (err) {
            console.error('Hiba a keresés során:', err);
            return res.status(500).json({ error: 'Belső hiba történt a keresés során' });
        }

        // Visszaadjuk a találatokat
        return res.status(200).json({ results: result });
    });
};

module.exports = { uploadNews, getAllNews, getAllNewsByID, searchNews};

