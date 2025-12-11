const express = require('express');
const cors = require('cors');
const salesRoutes = require('./routes/salesRoutes');
const { initializeDatabase } = require('./controllers/salesController');

const app = express();
const PORT = process.env.PORT || 10000;

const allowedOrigins = [
  "http://localhost:3000",          // CRA dev (if used)
  "http://localhost:5173",          // Vite dev
  "https://retaillogs.onrender.com",  // replace with your Render frontend URL
  "https://retaillog.onrender.com",  // replace with your Render frontend URL
  // add any other allowed origins here
];

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin like curl, mobile apps, server-to-server
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS Not Allowed: ' + origin));
  },
  credentials: true // if you use cookies/auth, keep this; otherwise set false
}));

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database connection
    await initializeDatabase();

    // Routes
    app.use('/api', salesRoutes);

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    });

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();