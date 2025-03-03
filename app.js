const path = require('path');
const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');

// Sajat csomagok importálása
const limiter = require('./middleware/limiter');
const authenticateToken = require('./middleware/jwtAuth');

// Útvonalak importálása
const authRoutes = require('./routes/authRoutes');
const topicRoutes = require('./routes/topicRoutes');
const profileRoutes = require('./routes/profileRoutes');
const newsRoutes = require('./routes/newsRoutes'); // importálás

const app = express();

// Middleware beállítások
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);
app.use(cookieParser());
app.use(cors({
    origin: 'https://deft-moonbeam-90e218.netlify.app',
    credentials: true
}));

// Statikus fájlok elérhetősége
app.use('/uploads', authenticateToken, express.static(path.join(__dirname, 'uploads')));

// Útvonalak használata
app.use('/api/auth', authRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/news', newsRoutes); // Az új newsRoutes hozzáadása

module.exports = app;
