const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
require('dotenv').config();

class SQLiteDatabaseService {
  constructor() {
    this.db = null;
    this.dbPath = path.join(__dirname, '../../data/truestate.db');
  }

  /**
   * Initialize SQLite database connection
   */
  async initialize() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('❌ Database connection failed:', err.message);
          reject(err);
        } else {
          console.log(`📁 SQLite database initialized at ${this.dbPath}`);
          this.createTables()
            .then(() => resolve(true))
            .catch(reject);
        }
      });
    });
  }

  /**
   * Create database tables if they don't exist
   */
  async createTables() {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customerName TEXT,
        phoneNumber TEXT,
        customerRegion TEXT,
        gender TEXT,
        age INTEGER,
        productCategory TEXT,
        productName TEXT,
        quantity INTEGER,
        basePrice REAL,
        discountPercentage REAL,
        taxPercentage REAL,
        finalAmount REAL,
        date TEXT,
        tags TEXT,
        paymentMethod TEXT,
        employeeName TEXT
      )
    `;

    return new Promise((resolve, reject) => {
      this.db.run(createTableSQL, (err) => {
        if (err) {
          console.error('❌ Failed to create table:', err.message);
          reject(err);
        } else {
          console.log('✅ Sales table ready');
          resolve(true);
        }
      });
    });
  }

  /**
   * Get transactions with filtering, sorting, and pagination
   */
  async getTransactions(filters = {}) {
    return new Promise((resolve, reject) => {
      let query = 'SELECT * FROM sales WHERE 1=1';
      const params = [];

      // Build WHERE clause
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

      if (filters.category && filters.category.length > 0) {
        const placeholders = filters.category.map(() => '?').join(',');
        query += ` AND productCategory IN (${placeholders})`;
        params.push(...filters.category);
      }

      if (filters.paymentMethod && filters.paymentMethod.length > 0) {
        const placeholders = filters.paymentMethod.map(() => '?').join(',');
        query += ` AND paymentMethod IN (${placeholders})`;
        params.push(...filters.paymentMethod);
      }

      if (filters.startDate) {
        query += ' AND date >= ?';
        params.push(filters.startDate);
      }
      if (filters.endDate) {
        query += ' AND date <= ?';
        params.push(filters.endDate);
      }

      // Get total count
      const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as count');
      this.db.get(countQuery, params, (err, countRow) => {
        if (err) {
          return reject(err);
        }

        const total = countRow?.count || 0;

        // Add sorting
        const sortBy = filters.sortBy || 'customerName';
        const order = (filters.order || 'asc').toUpperCase();
        query += ` ORDER BY ${this._sanitizeField(sortBy)} ${order}`;

        // Add pagination
        const page = parseInt(filters.page) || 1;
        const limit = parseInt(filters.limit) || 10;
        const offset = (page - 1) * limit;
        query += ` LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        this.db.all(query, params, (err, rows) => {
          if (err) {
            return reject(err);
          }

          resolve({
            data: rows || [],
            pagination: {
              page,
              limit,
              total,
              totalPages: Math.ceil(total / limit)
            }
          });
        });
      });
    });
  }

  /**
   * Get filter options from database
   */
  async getFilterOptions() {
    return new Promise((resolve, reject) => {
      const queries = {
        regions: () =>
          this.dbAll('SELECT DISTINCT customerRegion as value FROM sales WHERE customerRegion IS NOT NULL ORDER BY customerRegion'),
        genders: () =>
          this.dbAll('SELECT DISTINCT gender as value FROM sales WHERE gender IS NOT NULL ORDER BY gender'),
        categories: () =>
          this.dbAll('SELECT DISTINCT productCategory as value FROM sales WHERE productCategory IS NOT NULL ORDER BY productCategory'),
        paymentMethods: () =>
          this.dbAll('SELECT DISTINCT paymentMethod as value FROM sales WHERE paymentMethod IS NOT NULL ORDER BY paymentMethod'),
        minAge: () =>
          this.dbGet('SELECT MIN(age) as value FROM sales'),
        maxAge: () =>
          this.dbGet('SELECT MAX(age) as value FROM sales'),
        minDate: () =>
          this.dbGet('SELECT MIN(date) as value FROM sales'),
        maxDate: () =>
          this.dbGet('SELECT MAX(date) as value FROM sales')
      };

      Promise.all([
        queries.regions(),
        queries.genders(),
        queries.categories(),
        queries.paymentMethods(),
        queries.minAge(),
        queries.maxAge(),
        queries.minDate(),
        queries.maxDate()
      ])
        .then(([regions, genders, categories, paymentMethods, minAge, maxAge, minDate, maxDate]) => {
          resolve({
            regions: regions.map(r => r.value),
            genders: genders.map(g => g.value),
            categories: categories.map(c => c.value),
            paymentMethods: paymentMethods.map(p => p.value),
            ageRange: {
              min: minAge?.value || 0,
              max: maxAge?.value || 100
            },
            dateRange: {
              min: minDate?.value,
              max: maxDate?.value
            }
          });
        })
        .catch(reject);
    });
  }

  /**
   * Get statistics
   */
  async getStats(filters = {}) {
    return new Promise((resolve, reject) => {
      let query = `
        SELECT 
          COUNT(*) as totalTransactions,
          SUM(finalAmount) as totalRevenue,
          SUM(quantity) as totalQuantity,
          AVG(finalAmount) as averageOrderValue
        FROM sales WHERE 1=1
      `;
      const params = [];

      // Apply same filters
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

      this.db.get(query, params, (err, stats) => {
        if (err) {
          return reject(err);
        }

        resolve({
          totalTransactions: stats.totalTransactions || 0,
          totalRevenue: parseFloat(stats.totalRevenue || 0).toFixed(2),
          totalQuantity: stats.totalQuantity || 0,
          averageOrderValue: parseFloat(stats.averageOrderValue || 0).toFixed(2)
        });
      });
    });
  }

  /**
   * Insert bulk records (for migration)
   */
  async insertBulk(records) {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run('BEGIN TRANSACTION');

        const stmt = this.db.prepare(`
          INSERT INTO sales (customerName, phoneNumber, customerRegion, gender, age, productCategory, productName, quantity, basePrice, discountPercentage, taxPercentage, finalAmount, date, tags, paymentMethod, employeeName)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        let inserted = 0;
        for (const record of records) {
          stmt.run([
            record.customerName,
            record.phoneNumber,
            record.customerRegion,
            record.gender,
            record.age,
            record.productCategory,
            record.productName,
            record.quantity,
            record.basePrice,
            record.discountPercentage,
            record.taxPercentage,
            record.finalAmount,
            record.date,
            record.tags,
            record.paymentMethod,
            record.employeeName
          ], (err) => {
            if (err) console.error('❌ Insert error:', err);
            inserted++;
          });
        }

        stmt.finalize((err) => {
          if (err) {
            this.db.run('ROLLBACK');
            return reject(err);
          }

          this.db.run('COMMIT', (err) => {
            if (err) {
              return reject(err);
            }
            resolve(inserted);
          });
        });
      });
    });
  }

  /**
   * Helper: Promise-based db.all
   */
  dbAll(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  /**
   * Helper: Promise-based db.get
   */
  dbGet(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(query, params, (err, row) => {
        if (err) reject(err);
        else resolve(row || null);
      });
    });
  }

  /**
   * Close database
   */
  close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) reject(err);
          else {
            console.log('Database connection closed');
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  /**
   * Sanitize field name
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

module.exports = SQLiteDatabaseService;
