const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 1) {  // Ha a felhasználó nem admin (role ≠ 1)
        return res.status(403).json({ error: 'Nincs admin jogosultság' });
    }
    next();
};

module.exports = isAdmin;
