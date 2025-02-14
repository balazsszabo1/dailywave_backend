const dotenv = require('dotenv');

dotenv.config();

const config = {
    PORT: process.env.PORT,
    HOSTNAME: process.env.HOSTNAME,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_DATABASE: process.env.DB_DATABASE,
    JWT_SECRET: process.env.JWT_SECRET
}

module.exports = { config };