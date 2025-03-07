const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../models/db');
const { log } = require('console');
const router = express.Router();

// Kép feltöltés beállítása
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(req.headers);
    cb(null, 'uploads/'); // A fájlok ide kerülnek
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Egyedi fájlnév
  },
});

const upload = multer({ storage: storage });

// Kép feltöltés végpont
router.post('/upload-image', upload.single('file'), (req, res) => {
  console.log(req.file);
  
  if (!req.file) {
    return res.status(400).send({ message: 'Kép nem található.' });
  }
  res.status(200).send({
    message: 'Kép sikeresen feltöltve!',
    fileUrl: `/uploads/${req.file.filename}`,
  });
});

// Új hír hozzáadása
router.post('/add-news', (req, res) => {
  const { title, fullTitle, description, category, imageUrl } = req.body;
  console.log(title, fullTitle, description, category, imageUrl);
  
  if (!title || !fullTitle || !description || !category) {
    return res.status(400).send({ message: 'Minden mező kitöltése kötelező!' });
  }

  // Kategória ID lekérdezése a kategória nevéből
  const queryCategory = 'SELECT cat_id FROM categories WHERE category_name = ?';
  db.query(queryCategory, [category], (err, categoryResult) => {
    if (err) {
      console.log(`adatbázis hiba: ${err}`);
      
      return res.status(500).send({ message: 'Hiba történt a kategória lekérdezésekor.', error: err });
    }
    
    if (categoryResult.length === 0) {
      return res.status(404).send({ message: 'Kategória nem található!' });
    }

    const cat_id = categoryResult[0].cat_id;  // Kategória ID-ja
    console.log(cat_id);
    
    // Hír adatainak mentése
    const query = 'INSERT INTO news (cat_id, news_title, news, index_pic) VALUES (?, ?, ?, ?)';
    db.query(query, [cat_id, title, description, imageUrl], (err, result) => {
      if (err) {
        console.log(`adatbázis hiba hír mentésekor: ${err}`);
        
        return res.status(500).send({ message: 'Hiba történt a hír mentésekor.', error: err });
      }
      res.status(201).send({ message: 'Hír sikeresen hozzáadva!', id: result.insertId });
    });
  });
});

// Kategóriák lekérdezése
router.get('/categories', (req, res) => {
  const query = 'SELECT * FROM categories'; // Kategóriák lekérdezése az adatbázisból
  db.query(query, (err, result) => {
    if (err) {
      console.log(`adatbázis hiba kategória lekérésekor: ${err}`);
      
      return res.status(500).send({ message: 'Hiba történt a kategóriák lekérdezésekor.', error: err });
    }
    res.status(200).send(result);
  });
});

// Hír frissítése
router.put('/update-news/:id', (req, res) => {
  const { title, fullTitle, description, category, imageUrl } = req.body;
  const { id } = req.params;
  console.log(title, fullTitle, description, category, imageUrl);
  console.log(id);
    

  const queryCategory = 'SELECT cat_id FROM categories WHERE category_name = ?';
  db.query(queryCategory, [category], (err, categoryResult) => {
    if (err) {
      console.log(`hiba az adatbázisban a kategória lekérésekor: ${err}`);
      
      return res.status(500).send({ message: 'Hiba történt a kategória lekérdezésekor.', error: err });
    }

    if (categoryResult.length === 0) {
      return res.status(404).send({ message: 'Kategória nem található!' });
    }

    const cat_id = categoryResult[0].cat_id;  // Kategória ID-ja
    console.log(cat_id);
    
    const query = 'UPDATE news SET news_title = ?, news = ?, cat_id = ?, index_pic = ? WHERE news_id = ?';
    db.query(query, [title, description, cat_id, imageUrl, id], (err, result) => {
      if (err) {
        console.log(`hiba a hír frissítésekor: ${err}`);
        
        return res.status(500).send({ message: 'Hiba történt a hír frissítésekor.', error: err });
      }
      res.status(200).send({ message: 'Hír sikeresen frissítve!' });
    });
  });
});

module.exports = router;
