const mysql = require('mysql2/promise');
require('dotenv').config();

class DatabaseService {
  constructor() {
    this.pool = null;
  }

  /**
   * Initialize MySQL connection pool
   */
  async initialize() {
    try {
      this.pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'truestate_db',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelayMs: 0
      });

      // Test connection
      const connection = await this.pool.getConnection();
      await connection.ping();
      connection.release();

      console.log('✅ MySQL Database connected');
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      throw error;
    }
  }

  /**
   * Get transactions with filtering, sorting, and pagination
   */
  async getTransactions(filters = {}) {
    try {
      let query = 'SELECT * FROM sales WHERE 1=1';
      const params = [];

      // Search by customer name or phone
      if (filters.search) {
        query += ' AND (customerName LIKE ? OR phoneNumber LIKE ?)';
        params.push(`%${filters.search}%`, `%${filters.search}%`);
      }

      // Region filter
      if (filters.region && filters.region.length > 0) {
        const placeholders = filters.region.map(() => '?').join(',');
        query += ` AND customerRegion IN (${placeholders})`;
        params.push(...filters.region);
      }

      // Gender filter
      if (filters.gender && filters.gender.length > 0) {
        const placeholders = filters.gender.map(() => '?').join(',');
        query += ` AND gender IN (${placeholders})`;
        params.push(...filters.gender);
      }

      // Age range filter
      if (filters.minAge) {
        query += ' AND age >= ?';
        params.push(parseInt(filters.minAge));
      }
      if (filters.maxAge) {
        query += ' AND age <= ?';
        params.push(parseInt(filters.maxAge));
      }

      // Category filter
      if (filters.category && filters.category.length > 0) {
        const placeholders = filters.category.map(() => '?').join(',');
        query += ` AND productCategory IN (${placeholders})`;
        params.push(...filters.category);
      }

      // Payment method filter
      if (filters.paymentMethod && filters.paymentMethod.length > 0) {
        const placeholders = filters.paymentMethod.map(() => '?').join(',');
        query += ` AND paymentMethod IN (${placeholders})`;
        params.push(...filters.paymentMethod);
      }

      // Date range filter
      if (filters.startDate) {
        query += ' AND date >= ?';
        params.push(filters.startDate);
      }
      if (filters.endDate) {
        query += ' AND date <= ?';
        params.push(filters.endDate);
      }

      // Get total count for pagination
      const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as count');
      const connection = await this.pool.getConnection();
      const [countResult] = await connection.query(countQuery, params);
      const total = countResult[0].count;

      // Sorting
      const sortBy = filters.sortBy || 'customerName';
      const order = (filters.order || 'asc').toUpperCase();
      query += ` ORDER BY ${this._sanitizeField(sortBy)} ${order}`;

      // Pagination
      const page = parseInt(filters.page) || 1;
      const limit = parseInt(filters.limit) || 10;
      const offset = (page - 1) * limit;
      query += ` LIMIT ? OFFSET ?`;
      params.push(limit, offset);

      const [rows] = await connection.query(query, params);
      connection.release();

      return {
        data: rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error fetching transactions:', error.message);
      throw error;
    }
  }

  /**
   * Get distinct values for filter options
   */
  async getFilterOptions() {
    try {
      const connection = await this.pool.getConnection();

      const queries = {
        regions: 'SELECT DISTINCT customerRegion as value FROM sales WHERE customerRegion IS NOT NULL ORDER BY customerRegion',
        genders: 'SELECT DISTINCT gender as value FROM sales WHERE gender IS NOT NULL ORDER BY gender',
        categories: 'SELECT DISTINCT productCategory as value FROM sales WHERE productCategory IS NOT NULL ORDER BY productCategory',
        paymentMethods: 'SELECT DISTINCT paymentMethod as value FROM sales WHERE paymentMethod IS NOT NULL ORDER BY paymentMethod',
        minAge: 'SELECT MIN(age) as value FROM sales',
        maxAge: 'SELECT MAX(age) as value FROM sales',
        minDate: 'SELECT MIN(date) as value FROM sales',
        maxDate: 'SELECT MAX(date) as value FROM sales'
      };

      const results = {};

      for (const [key, q] of Object.entries(queries)) {
        const [rows] = await connection.query(q);
        if (Array.isArray(rows)) {
          results[key] = rows.map(r => r.value);
        } else {
          results[key] = rows[0]?.value || null;
        }
      }

      connection.release();

      return {
        regions: results.regions || [],
        genders: results.genders || [],
        categories: results.categories || [],
        paymentMethods: results.paymentMethods || [],
        ageRange: {
          min: results.minAge[0] || 0,
          max: results.maxAge[0] || 100
        },
        dateRange: {
          min: results.minDate[0],
          max: results.maxDate[0]
        }
      };
    } catch (error) {
      console.error('Error fetching filter options:', error.message);
      throw error;
    }
  }

  /**
   * Get statistics
   */
  async getStats(filters = {}) {
    try {
      let query = `
        SELECT 
          COUNT(*) as totalTransactions,
          SUM(finalAmount) as totalRevenue,
          SUM(quantity) as totalQuantity,
          AVG(finalAmount) as averageOrderValue
        FROM sales WHERE 1=1
      `;
      const params = [];

      // Apply same filters as getTransactions
      if (filters.search) {
        query += ' AND (customerName LIKE ? OR phoneNumber LIKE ?)';
        params.push(`%${filters.search}%`, `%${filters.search}%`);
      }
      if (filters.region && filters.region.length > 0) {
        const placeholders = filters.region.map(() => '?').join(',');
        query += ` AND customerRegion IN (${placeholders})`;
        params.push(...filters.region);
      }
      if (filters.gender && filters.gender.length > 0) {
        const placeholders = filters.gender.map(() => '?').join(',');
        query += ` AND gender IN (${placeholders})`;
        params.push(...filters.gender);
      }
      if (filters.minAge) {
        query += ' AND age >= ?';
        params.push(parseInt(filters.minAge));
      }
      if (filters.maxAge) {
        query += ' AND age <= ?';
        params.push(parseInt(filters.maxAge));
      }
      if (filters.startDate) {
        query += ' AND date >= ?';
        params.push(filters.startDate);
      }
      if (filters.endDate) {
        query += ' AND date <= ?';
        params.push(filters.endDate);
      }

      const connection = await this.pool.getConnection();
      const [rows] = await connection.query(query, params);
      connection.release();

      const stats = rows[0];
      return {
        totalTransactions: stats.totalTransactions || 0,
        totalRevenue: parseFloat(stats.totalRevenue || 0).toFixed(2),
        totalQuantity: stats.totalQuantity || 0,
        averageOrderValue: parseFloat(stats.averageOrderValue || 0).toFixed(2)
      };
    } catch (error) {
      console.error('Error fetching stats:', error.message);
      throw error;
    }
  }

  /**
   * Close database connection pool
   */
  async close() {
    if (this.pool) {
      await this.pool.end();
      console.log('Database connection closed');
    }
  }

  /**
   * Sanitize field name to prevent SQL injection
   */
  _sanitizeField(field) {
    const allowedFields = [
      'customerName', 'phoneNumber', 'customerRegion', 'gender', 'age',
      'productCategory', 'productName', 'quantity', 'finalAmount', 'date',
      'paymentMethod'
    ];
    return allowedFields.includes(field) ? field : 'customerName';
  }
}

module.exports = DatabaseService;
