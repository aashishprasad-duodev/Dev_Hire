const cors = require("cors");
const express = require('express');
const app = express();
const errorMiddleware = require("./middleware/error.middleware");
const authRoutes = require('./routes/auth.routes');
const jobRoutes = require("./routes/job.routes");
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('DevHire server is running on port 5000');
})
app.use('/api/auth',authRoutes)
app.use("/api/jobs", jobRoutes);
app.use(errorMiddleware);


module.exports = app;