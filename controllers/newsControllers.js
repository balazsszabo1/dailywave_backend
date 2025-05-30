const db = require('../models/db');
const upload = require('../middleware/multer');

const uploadNews = (req, res) => {
  upload.single('index_pic')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: 'Hiba történt a fájl feltöltésekor: ' + err.message });
    }

    const { cat_id, news_title, news } = req.body;
    const index_pic = req.file ? req.file.filename : null;

    if (!cat_id || !news_title || !news || !index_pic) {
      return res.status(400).json({ error: 'Minden mező kitöltése kötelező.' });
    }

    const validCategories = [1, 2, 3, 4, 5];
    if (!validCategories.includes(Number(cat_id))) {
      return res.status(400).json({ error: 'Érvénytelen kategória.' });
    }

    const query = 'INSERT INTO news (cat_id, news_title, news, index_pic) VALUES (?, ?, ?, ?)';
    db.query(query, [cat_id, news_title, news, index_pic], (err, result) => {
      if (err) {
        console.error('Hiba történt az adatbázisba történő beszúráskor:', err);
        return res.status(500).json({ error: 'Hiba történt az adatbázis művelet során.' });
      }
      res.status(201).json({ message: 'Hír sikeresen feltöltve.', news_id: result.insertId });
    });
  });
};

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


const getAllNewsByID = (req, res) => {
  const { news_id } = req.query;
  const query = 'SELECT * FROM news WHERE news_id = ?';
  console.log(news_id)

  db.query(query, [news_id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Hiba a hír lekérése során.' });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'Hír nem található.' });
    }
    res.json(result[0]);
  });
};

const searchNews = (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Keresési kifejezés szükséges' });
  }

  const sql = 'SELECT news_id, news_title FROM news WHERE news_title LIKE ?';

  db.query(sql, [`%${query}%`], (err, result) => {
    if (err) {
      console.error('Hiba a keresés során:', err);
      return res.status(500).json({ error: 'Belső hiba történt a keresés során' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'Nem létezik ilyen szöveg' });
    }

    return res.status(200).json({ results: result });
  });
};

const newsLetter = (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'A név és az email cím szükséges!' });
  }

  const query = 'INSERT INTO newsletter (name, email) VALUES (?, ?)';
  db.execute(query, [name, email], (err, result) => {
    if (err) {
      console.error('Hiba történt a feliratkozás során:', err);
      return res.status(500).json({ message: 'Hiba történt a feliratkozás során' });
    }
    res.status(200).json({ message: 'Sikeres feliratkozás!' });
  });
};

module.exports = { uploadNews, getAllNews, getAllNewsByID, searchNews, newsLetter };