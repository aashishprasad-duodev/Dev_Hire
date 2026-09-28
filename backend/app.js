const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('DevHire server is running on port 5000');
})

module.exports = app;