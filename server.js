const express = require('express');

var app = express();

app.get('/', (req, resp) => {
    resp.send('Hello Express!');
});

app.get('/about', (req, resp) => {
    resp.send('About Page!');
});

app.listen(3000);