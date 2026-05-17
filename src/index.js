const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Fallback Body Parser: Postman-এ Content-Type ভুল সিলেক্ট করলেও যাতে req.body undefined না হয়
app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    if (req.body && Object.keys(req.body).length > 0) {
      return next();
    }
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      if (data) {
        try {
          req.body = JSON.parse(data);
        } catch (err) {
          try {
            const querystring = require('querystring');
            req.body = querystring.parse(data);
          } catch (e) { }
        }
      }
      next();
    });
  } else {
    next();
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/user', userRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('Node.js Backend is running!');
});

// Error Middleware
app.use(errorHandler);


// Database Connection & Server Startup
mongoose.connect(process.env.MONGODB_URI) 
  .then(() => {
    console.log('Connected to MongoDB successfully!');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB database connection error:', err);
    // Fallback: database connection failed, but start server on port 3000 anyway
    app.listen(3000, '0.0.0.0', () => {
      console.log('Server running on fallback port 3000. Note: MongoDB is not connected.');
    });
  });

// Export app for Vercel serverless deployment
module.exports = app;
