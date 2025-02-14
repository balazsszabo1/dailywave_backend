const app = require('./app');
const { config } = require('./config/dotenvConfig');

app.listen(config.PORT, () => {
    console.log(`IP: https://${config.HOSTNAME} || PORT: ${config.PORT}`);
});