const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/dotenvConfig').config;

const authenticateToken = (req, res, next) => {
    console.log(req.cookies);  // 🔹 Nézd meg, hogy van-e token a cookie-k között
    const token = req.cookies.auth_token;  

    if (!token) {
        return res.status(401).json({ error: 'Nincs érvényes token' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Érvénytelen token' });
        }

        console.log('🔹 Dekódolt token:', user);  // 🔹 Ellenőrizd, hogy a token tartalmazza-e a role-t
        req.user = user;  
        next();
    });
};

module.exports = authenticateToken;
