const db = require('../models/db');
const bcrypt = require('bcryptjs');
const sharp = require('sharp');
const validator = require('validator');
const path = require('path')

const editProfileName = (req, res) => {
    const name = req.body.name;
    const user_id = req.user.id;

    const sql = 'UPDATE users SET username = COALESCE(NULLIF(?, ""), username) WHERE user_id = ?';

    db.query(sql, [name, user_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Hiba az SQL-ben' });
        }

        return res.status(200).json({ message: 'Név frissítve' });
    });
};

const getProfileName = (req, res) => {
    const user_id = req.user.id;
    console.log('Felhasználó ID:', user_id);

    const sql = 'SELECT username FROM users WHERE user_id = ?';
    db.query(sql, [user_id], (err, result) => {
        if (err) {
            console.error('Hiba a lekérdezésnél:', err);
            return res.status(500).json({ error: 'Hiba a név lekérésekor' });
        }

        console.log('Lekérdezés eredménye:', result);

        if (result.length > 0) {
            return res.json({ name: result[0].username });
        } else {
            console.log('Nem található felhasználó ezzel az ID-val:', user_id);
            return res.status(404).json({ error: 'Név nem található' });
        }
    });
};

const editProfilePsw = (req, res) => {
    const psw = req.body.psw;
    const user_id = req.user.id;

    const salt = 10;

    if (!psw || !validator.isLength(psw, { min: 6 })) {
        return res.status(400).json({ error: 'A jelszónak legalább 6 karakterből kell állnia' });
    }

    bcrypt.hash(psw, salt, (err, hash) => {
        if (err) {
            return res.status(500).json({ error: 'Hiba a sózáskor' });
        }

        const sql = 'UPDATE users SET password = COALESCE(NULLIF(?, ""), password) WHERE user_id = ?';
        db.query(sql, [hash, user_id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Hiba az SQL-ben' });
            }

            return res.status(200).json({ message: 'Jelszó frissítve' });
        });
    });
};

const editProfilePic = (req, res) => {
    const user_id = req.user.id;
    const profile_picture = req.file ? req.file.filename : null;

    if (!user_id) {
        return res.status(400).json({ error: 'A felhasználó ID-ja kötelező' });
    }

    const sql = 'UPDATE users SET profile_picture = COALESCE(NULLIF(?, ""), profile_picture) WHERE user_id = ?';

    db.query(sql, [profile_picture, user_id], (err, result) => {
        if (err) {
            console.error('SQL hiba: ', err);
            return res.status(500).json({ error: 'Adatbázis hiba, kérlek próbáld újra később.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Felhasználó nem található' });
        }

        return res.status(200).json({ message: 'Profilkép sikeresen frissítve' });
    });
};

const getProfilePic = (req, res) => {
    const user_id = req.user.id;
    const sql = 'SELECT profile_picture FROM users WHERE user_id = ?';
    db.query(sql, [user_id], (err, result) => {
        if (err) {
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