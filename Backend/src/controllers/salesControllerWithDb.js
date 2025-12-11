const DatabaseService = require('../services/databaseService');

// Initialize database service
let dbService;
let isDbReady = false;

/**
 * Initialize the database connection on server startup
 */
async function initializeDatabase() {
  try {
    dbService = new DatabaseService();
    await dbService.initialize();
    isDbReady = true;
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error.message);
    console.log('⚠️  Falling back to CSV mode. Install MySQL or configure .env file.');
    isDbReady = false;
  }
}

/**
 * Middleware to check database readiness
 */
function checkDatabaseReady(req, res, next) {
  if (!isDbReady) {
    return res.status(503).json({
      success: false,
      message: 'Database not initialized. Please configure MySQL and .env file.',
      error: 'Service Unavailable'
    });
  }
  next();
}

/**
 * Get transactions with search, filter, sort, and pagination
 */
exports.getTransactions = [
  checkDatabaseReady,
  async (req, res) => {
    try {
      const result = await dbService.getTransactions(req.query);

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error in getTransactions:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch transactions',
        error: error.message
      });
    }
  }
];

/**
 * Get available filter options
 */
exports.getFilterOptions = [
  checkDatabaseReady,
  async (req, res) => {
    try {
      const options = await dbService.getFilterOptions();

      res.json({
        success: true,
        data: options
      });
    } catch (error) {
      console.error('Error in getFilterOptions:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch filter options',
        error: error.message
      });
    }
  }
];

/**
 * Get statistics/summary
 */
exports.getStats = [
  checkDatabaseReady,
  async (req, res) => {
    try {
      const stats = await dbService.getStats(req.query);

      res.json({
        success: true,
        stats
      });
    } catch (error) {
      console.error('Error in getStats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch statistics',
        error: error.message
      });
    }
  }
];

/**
 * Health check endpoint
 */
exports.health = (req, res) => {
  res.json({
    status: 'OK',
    database: isDbReady ? 'Connected' : 'Not Connected',
    timestamp: new Date().toISOString()
  });
};

/**
 * Export initialization function for server startup
 */
exports.initializeDatabase = initializeDatabase;
