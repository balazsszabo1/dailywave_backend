const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/dotenvConfig').config;

const checkAuth = (req, res, next) => {
    let token = req.cookies?.auth_token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Nincs érvényes token, kérlek jelentkezz be' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Érvénytelen token' });
        }
        req.user = decoded;
        next();
    });
};

module.exports = checkAuth;
