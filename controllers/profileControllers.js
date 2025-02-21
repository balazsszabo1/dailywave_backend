const db = require('../models/db');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { JWT_SECRET } = require('../config/dotenvConfig').config;

const editProfileName = (req, res) => {
    const name = req.body.name;
    const user_id = req.user.id;

    if (!user_id) {
        return res.status(401).json({ error: 'Nincs érvényes token, kérlek jelentkezz be' });
    }

    if (!name || validator.isEmpty(name)) {
        return res.status(400).json({ error: 'A felhasználónév nem lehet üres' });
    }

    const sql = 'UPDATE users SET username = COALESCE(NULLIF(?, ""), username) WHERE user_id = ?';

    db.query(sql, [name, user_id], (err, result) => {
        if (err) {
            console.error('SQL Error:', err);
            return res.status(500).json({ error: 'Hiba az SQL-ben' });
        }

        return res.status(200).json({ message: 'Név sikeresen frissítve' });
    });
};

const getProfileName = (req, res) => {
    const user_id = req.user.id;

    if (!user_id) {
        return res.status(401).json({ error: 'Nincs érvényes token, kérlek jelentkezz be' });
    }

    const sql = 'SELECT username FROM users WHERE user_id = ?';
    db.query(sql, [user_id], (err, result) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ error: 'Hiba a név lekérésekor' });
        }

        if (result.length > 0) {
            return res.json({ name: result[0].username });
        } else {
            return res.status(404).json({ error: 'Felhasználó nem található' });
        }
    });
};

const editProfilePsw = (req, res) => {
    const psw = req.body.psw;
    const user_id = req.user.id;

    if (!user_id) {
        return res.status(401).json({ error: 'Nincs érvényes token, kérlek jelentkezz be' });
    }

    if (!psw || !validator.isLength(psw, { min: 6 })) {
        return res.status(400).json({ error: 'A jelszónak legalább 6 karakterből kell állnia' });
    }

    const salt = 10;

    bcrypt.hash(psw, salt, (err, hash) => {
        if (err) {
            console.error('Hiba a jelszó hash-elésénél:', err);
            return res.status(500).json({ error: 'Hiba a jelszó biztonságos tárolása során' });
        }

        const sql = 'UPDATE users SET password = COALESCE(NULLIF(?, ""), password) WHERE user_id = ?';
        db.query(sql, [hash, user_id], (err, result) => {
            if (err) {
                console.error('SQL Hiba:', err);
                return res.status(500).json({ error: 'Hiba az SQL-ben' });
            }

            return res.status(200).json({ message: 'Jelszó sikeresen frissítve' });
        });
    });
};

const editProfilePic = (req, res) => {
    const user_id = req.user.id;
    const profile_picture = req.file ? req.file.filename : null;

    if (!user_id) {
        return res.status(401).json({ error: 'Nincs érvényes token, kérlek jelentkezz be' });
    }

    if (!profile_picture) {
        return res.status(400).json({ error: 'Kérlek válassz egy új profilképet' });
    }

    const sql = 'UPDATE users SET profile_picture = COALESCE(NULLIF(?, ""), profile_picture) WHERE user_id = ?';

    db.query(sql, [profile_picture, user_id], (err, result) => {
        if (err) {
            console.error('SQL Error: ', err);
            return res.status(500).json({ error: 'Hiba a profilkép frissítésekor' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Felhasználó nem található' });
        }

        return res.status(200).json({ message: 'Profilkép sikeresen frissítve' });
    });
};

const getProfilePic = (req, res) => {
    const user_id = req.user.id;

    if (!user_id) {
        return res.status(401).json({ error: 'Nincs érvényes token, kérlek jelentkezz be' });
    }

    const sql = 'SELECT profile_picture FROM users WHERE user_id = ?';
    db.query(sql, [user_id], (err, result) => {
        if (err) {
            console.error('Hiba a profilkép lekérésekor:', err);
            return res.status(500).json({ error: 'Hiba a profilkép lekérésekor' });
        }

        if (result.length > 0 && result[0].profile_picture) {
            return res.json({ profilePicUrl: `/uploads/${result[0].profile_picture}` });
        } else {
            return res.json({ profilePicUrl: null });
        }
    });
};

module.exports = { editProfileName, editProfilePic, editProfilePsw, getProfileName, getProfilePic };
