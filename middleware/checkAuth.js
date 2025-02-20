const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/dotenvConfig').config;

const checkAuth = (req, res, next) => {
    // Extract token from cookies or Authorization header
    let token = req.cookies?.auth_token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
        return res.status(401).json({ error: 'Token nem található, kérlek jelentkezz be' });
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

