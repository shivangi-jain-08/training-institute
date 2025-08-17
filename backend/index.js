const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const memberRoutes = require('./routes/members');
const reminderScheduler = require('./utils/reminderScheduler');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true
}));

// app.use(cors({
//   origin: process.env.NODE_ENV === 'production' 
//     ? ['https://member-manager-client.vercel.app'] 
//     : ['http://localhost:5173', 'http://localhost:3000'],
//   credentials: true
// }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100 
});
app.use(limiter);

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

reminderScheduler.start();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});