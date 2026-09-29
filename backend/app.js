const express = require('express');
const app = express();
const authRoutes = require('./routes/auth.routes');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('DevHire server is running on port 5000');
})

app.use('/api/auth',authRoutes)


module.exports = app;