require('dotenv').config();
const express = require('express');
const cors = require('cors');
const eventRoutes = require('./routes/events');
const connectDB = require('./config/database');

const app = express();

// Middleware - MAKE SURE THIS IS BEFORE ROUTES
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.use('/api/events', eventRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'scaler Calendar API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});