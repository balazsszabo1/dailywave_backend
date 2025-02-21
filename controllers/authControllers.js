const bcrypt = require('bcryptjs');
const validator = require('validator');
const db = require('../models/db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/dotenvConfig').config;

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: 'Érvénytelen email cím' });
        }

        if (validator.isEmpty(password)) {
            return res.status(400).json({ error: 'A jelszó megadása kötelező' });
        }

        const [users] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(401).json({ error: 'Helytelen email cím vagy jelszó' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Helytelen email cím vagy jelszó' });
        }

        const token = jwt.sign({ id: user.user_id }, JWT_SECRET, { expiresIn: '1y' });

        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 3600000 * 24 * 31 * 12, // 1 év
        });

        return res.status(200).json({ message: 'Sikeres bejelentkezés', token });

    } catch (err) {
        console.error('Bejelentkezési hiba:', err);
        return res.status(500).json({ error: 'Belső szerverhiba' });
    }
};

const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !validator.isEmail(email)) {
            return res.status(400).json({ error: 'Nem valós email' });
        }

        if (!password || !validator.isLength(password, { min: 6 })) {
            return res.status(400).json({ error: 'A jelszónak minimum 6 karakterből kell állnia' });
        }

        if (!name || validator.isEmpty(name)) {
            return res.status(400).json({ error: 'Töltsd ki a nevet' });
        }

        const [existingUsers] = await db.promise().query(
            'SELECT * FROM users WHERE email = ? OR username = ?',
            [email, name]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({
                error: existingUsers.some(user => user.email === email)
                    ? 'Az email már foglalt'
                    : 'A felhasználónév már foglalt'
            });
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
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });

    res.status(200).json({ message: 'Sikeresen kijelentkeztél' });
};

module.exports = { register, login, logout };
