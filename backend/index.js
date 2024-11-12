const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(cors());

app.get('/api', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
          res.status(500).send('Error reading data');
        } else {
          res.json(JSON.parse(data));
        }
      });
});

app.listen(5000, () => {
  console.log('Server listening on port 5000');
});