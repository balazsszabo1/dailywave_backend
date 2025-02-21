//telepitett csomag imp
const path = require('path');
const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
//sajat csomag imp
const limiter = require('./middleware/limiter');
const authenticateToken = require('./middleware/jwtAuth');
// utvonalak imp
const authRoutes = require('./routes/authRoutes');
const topicRoutes = require('./routes/topicRoutes');
const profileRoutes = require('./routes/profileRoutes');

const app = express();

// Engedélyezzük a trust proxy-t (proxy mögött futó alkalmazásokhoz szükséges)
app.set('trust proxy', false); 

//middleware config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter); // Ha van rate limit middleware, győződj meg, hogy az a helyén van
app.use(cookieParser());
app.use(cors({
    origin: 'https://deft-moonbeam-90e218.netlify.app',
    credentials: true
}));

//statikus fajlok elerese
app.use('/uploads', authenticateToken, express.static(path.join(__dirname, 'uploads')));

//utvonalak hasznalata
app.use('/api/auth', authRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/profile', profileRoutes);

module.exports = app;
