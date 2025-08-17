const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/violations', require('./routes/violationRoutes'));
app.use('/api/challans', require('./routes/challanRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`API running on port ${PORT}`));
  } catch (err) {
    console.error('Mongo connection error:', err.message);
    process.exit(1);
  }
}

start();

module.exports = app;
