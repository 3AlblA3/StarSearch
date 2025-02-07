require('dotenv').config();
const init = require('./app');

init().catch(err => {
    console.error('Server failed to start:', err);
    process.exit(1);
});
