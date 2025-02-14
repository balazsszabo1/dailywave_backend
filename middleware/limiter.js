const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 1000 * 60 * 15,
    max: 1000
});

module.exports = limiter;