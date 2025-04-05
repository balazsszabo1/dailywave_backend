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
const newsRoutes = require('./routes/newsRoutes');
const adminRoutes = require('./routes/adminRoutes')
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);
app.use(cookieParser());
app.use(cors({
    origin: 'https://dailywave.netlify.app',
    credentials: true
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes)
app.use('/api/topics', topicRoutes)
app.use('/api/profile', profileRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/news', newsRoutes);

module.exports = app;