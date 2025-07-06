const express = require('express');
const fs = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;

const fallbackQuotes = JSON.parse(fs.readFileSync(path.join(__dirname, 'quotes.json')));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/api/quote', async (req, res) => {
    try {
        const response = await fetch('https://zenquotes.io/api/random', {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        res.json(data[0]);
    } catch (err) {
        console.error('API failed:', err.message);
        const fallback = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
        res.json(fallback);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
