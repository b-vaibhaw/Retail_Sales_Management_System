const SQLiteDatabaseService = require('../services/sqliteDatabaseService');

// Initialize database service
let dbService;
let isDbReady = false;

/**
 * Initialize the database connection on server startup
 */
async function initializeDatabase() {
  try {
    dbService = new SQLiteDatabaseService();
    await dbService.initialize();
    isDbReady = true;
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error.message);
    isDbReady = false;
    throw error;
  }
}

/**
 * Middleware to check database readiness
 */
function checkDatabaseReady(req, res, next) {
  if (!isDbReady) {
    return res.status(503).json({
      success: false,
      message: 'Database not initialized.',
      error: 'Service Unavailable'
    });
  }
  next();
}

// Helper function to parse filter arrays from query params
function parseFilters(query) {
  const filters = { ...query };
  
  // Convert comma-separated strings to arrays for multi-select filters
  const arrayFields = ['region', 'gender', 'category', 'paymentMethod'];
  
  for (const field of arrayFields) {
    if (filters[field]) {
      if (typeof filters[field] === 'string') {
        filters[field] = filters[field].split(',').filter(v => v.trim());
      } else if (Array.isArray(filters[field])) {
        filters[field] = filters[field].flat().map(v => v.toString());
      }
    } else {
      filters[field] = [];
    }
  }
  
  return filters;
}

// Get transactions with search, filter, sort, and pagination
exports.getTransactions = [
  checkDatabaseReady,
  async (req, res) => {
    try {
      const filters = parseFilters(req.query);
      const result = await dbService.getTransactions(filters);

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

// Get available filter options
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

// Get statistics/summary
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

// Export initialization function for server startup
exports.initializeDatabase = initializeDatabase;