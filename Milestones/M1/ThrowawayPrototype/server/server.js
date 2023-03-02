const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config({ path: './config.env' });
const port = process.env.EXPRESS_PORT;

app.use(cors());
app.use(express.json());

// For testing our NGINX proxy
app.get('/api/', (_, res) => {
    res.send('Gatormmunity~');
});

app.listen(port, () => {
    console.log(`Express server listening on port ${port}.`);
});

module.exports = app;