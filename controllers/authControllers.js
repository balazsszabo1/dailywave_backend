const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const db = require('../models/db');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { JWT_SECRET } = require('../config/dotenvConfig').config;

const app = express();

// 🟢 CORS beállítások
app.use(cors({
    origin: 'https://deft-moonbeam-90e218.netlify.app', // Frontend URL
    credentials: true // Engedélyezi a sütik küldését
}));

app.use(express.json());
app.use(cookieParser()); // 🟢 Engedélyezi a sütik kezelését

const login = (req, res) => {
    const { email, password } = req.body;

    const errors = [];
    if (!validator.isEmail(email)) {
        errors.push({ error: 'Add meg az email címet' });
    }
    if (validator.isEmpty(password)) {
        errors.push({ error: 'Add meg a jelszót' });
    }
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    const sql = 'SELECT * FROM users WHERE email LIKE ?';
    db.query(sql, [email], (err, result) => {
        if (err) {
            console.error('SQL Hiba:', err);
            return res.status(500).json({ error: 'Belső hiba történt a szerveren' });
        }
        if (result.length === 0) {
            return res.status(401).json({ error: 'Helytelen email cím vagy jelszó' });
        }

        const user = result[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Jelszó ellenőrzési hiba:', err);
                return res.status(500).json({ error: 'Hiba történt a jelszó ellenőrzésekor' });
            }
            if (isMatch) {
                const token = jwt.sign(
                    { id: user.user_id },
                    JWT_SECRET,
                    { expiresIn: '1y' }
                );

                // 🟢 SÜTI BEÁLLÍTÁS: Secure mód Netlify frontendhez
                res.cookie('auth_token', token, {
                    httpOnly: true,
                    secure: true, // HTTPS miatt kell
                    sameSite: 'none', // Más domain miatt kell
                    maxAge: 3600000 * 24 * 31 * 12, // 1 év
                });

                return res.status(200).json({ message: 'Sikeres bejelentkezés' });
            } else {
                return res.status(401).json({ error: 'Helytelen email cím vagy jelszó' });
            }
        });
    });
};

const register = async (req, res) => {
    const { email, password, name } = req.body;
    const errors = [];

    if (!email || !validator.isEmail(email)) {
        errors.push({ error: 'Nem valós email' });
    }
    if (!password || !validator.isLength(password, { min: 6 })) {
        errors.push({ error: 'A jelszónak minimum 6 karakterből kell állnia' });
    }
    if (!name || validator.isEmpty(name)) {
        errors.push({ error: 'Töltsd ki a nevet' });
    }
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        const [existingUsers] = await db.promise().query(
            'SELECT * FROM users WHERE email = ? OR username = ?',
            [email, name]
        );

        if (existingUsers.length > 0) {
            const conflicts = [];
            if (existingUsers.some(user => user.email === email)) {
                conflicts.push('Az email már foglalt');
            }
            if (existingUsers.some(user => user.username === name)) {
                conflicts.push('A felhasználónév már foglalt');
            }
            return res.status(400).json({ errors: conflicts.map(error => ({ error })) });
        }

        const hash = await bcrypt.hash(password, 10);
        await db.promise().query(
            'INSERT INTO users (email, password, role, profile_picture, username) VALUES (?, ?, ?, ?, ?)',
            [email, hash, '0', 'default.png', name]
        );

        return res.status(201).json({ message: 'Sikeres regisztráció' });
    } catch (err) {
        console.error('Hiba történt a regisztráció során:', err);
        return res.status(500).json({ error: 'Hiba történt a szerveren' });
    }
};

const logout = (req, res) => {
    res.clearCookie('auth_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    });
    res.status(200).json({ message: 'Sikeresen kijelentkeztél' });
};

module.exports = { register, login, logout };
