const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/dotenvConfig').config;

const authenticateToken = (req, res, next) => {
    const token = req.cookies.auth_token;  // A token a cookie-ban van

    if (!token) {
        return res.status(401).json({ error: 'Nincs érvényes token' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Érvénytelen token' });
        }

        req.user = user;  // A token-ben lévő adatokat a kéréshez adjuk
        next();
    });
};

module.exports = authenticateToken;