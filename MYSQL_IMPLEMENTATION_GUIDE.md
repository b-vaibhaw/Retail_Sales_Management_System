# MySQL Database Implementation Guide

## Overview

This guide explains how to migrate your TruEstate sales management system from **CSV file storage** to **MySQL database**.

### Why Switch to MySQL?

| Feature | CSV | MySQL |
|---------|-----|-------|
| Query Performance | O(n) full scan | O(log n) with indexes |
| Concurrent Users | Limited | ✅ Concurrent access |
| Data Integrity | No validation | ✅ Constraints & validation |
| Storage Size | Limited by RAM | ✅ Gigabytes/Terabytes |
| Real-time Updates | Requires restart | ✅ Instant updates |
| Backup/Recovery | Manual | ✅ Automated tools |
| Scalability | Single machine | ✅ Replication & clustering |

---

## Installation Steps

### 1. Install MySQL

**Windows:**
- Download: https://dev.mysql.com/downloads/mysql/
- Run installer, set password for root user
- Default port: 3306

**macOS (Homebrew):**
```bash
brew install mysql
brew services start mysql
mysql_secure_installation  # Set root password
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

Verify installation:
```bash
mysql --version
mysql -u root -p  # Enter password, should connect
```

---

### 2. Install Node Dependencies

```powershell
cd D:\SDE_Intern\Backend
npm install mysql2 dotenv
```

---

### 3. Create Database and Table

**Option A: Using MySQL Command Line**

```powershell
mysql -u root -p
```

Then paste this SQL:

```sql
CREATE DATABASE IF NOT EXISTS truestate_db;
USE truestate_db;

CREATE TABLE sales (
  id INT PRIMARY KEY AUTO_INCREMENT,
  customerName VARCHAR(100),
  phoneNumber VARCHAR(20),
  customerRegion VARCHAR(50),
  gender VARCHAR(20),
  age INT,
  productCategory VARCHAR(50),
  productName VARCHAR(100),
  quantity INT,
  basePrice DECIMAL(10, 2),
  discountPercentage DECIMAL(5, 2),
  taxPercentage DECIMAL(5, 2),
  finalAmount DECIMAL(10, 2),
  date DATE,
  tags VARCHAR(255),
  paymentMethod VARCHAR(50),
  INDEX idx_region (customerRegion),
  INDEX idx_gender (gender),
  INDEX idx_age (age),
  INDEX idx_category (productCategory),
  INDEX idx_payment (paymentMethod),
  INDEX idx_date (date)
);
```

**Option B: Using MySQL Workbench**
1. Download: https://dev.mysql.com/downloads/workbench/
2. Create new connection (localhost, port 3306, root/password)
3. Right-click → Create Schema → Name it `truestate_db`
4. Open Query tab and paste the SQL above

---

### 4. Configure Environment Variables

Create `.env` file in `Backend/` folder:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_actual_mysql_password
DB_NAME=truestate_db
NODE_ENV=development
PORT=5000
```

**Important:** Never commit `.env` to Git. Add it to `.gitignore`:
```
.env
node_modules/
```

---

### 5. Load CSV Data into MySQL

Two options:

**Option A: Use the migration script (Recommended)**

```powershell
cd D:\SDE_Intern\Backend
node scripts/migrateToMySQL.js
```

This will:
- Read your `data/sales.csv`
- Insert all 1M records into MySQL
- Show progress and final count

**Option B: MySQL's LOAD DATA command**

```sql
LOAD DATA LOCAL INFILE 'D:/SDE_Intern/Backend/data/sales.csv'
INTO TABLE sales
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
IGNORE 1 ROWS;
```

---

### 6. Switch Backend to MySQL

**Current structure:**
```
Backend/src/
  ├── index.js (uses CSV loader)
  ├── controllers/
  │   └── salesController.js (CSV-based)
  ├── services/
  │   ├── salesService.js (in-memory filtering)
  │   └── databaseService.js (NEW - MySQL queries)
```

**To switch to MySQL:**

1. Backup current version:
   ```powershell
   cd D:\SDE_Intern\Backend\src
   copy index.js index-csv-backup.js
   copy controllers\salesController.js controllers\salesController-csv.js
   ```

2. Replace with MySQL versions:
   ```powershell
   copy index-mysql.js index.js
   copy controllers\salesControllerWithDb.js controllers\salesController.js
   ```

3. Update `routes/salesRoutes.js` (if needed):
   ```javascript
   // Old import
   const salesController = require('../controllers/salesController');
   
   // Routes still work the same way!
   router.get('/transactions', salesController.getTransactions);
   ```

---

### 7. Start the Server

```powershell
cd D:\SDE_Intern\Backend
npm start
```

Expected output:
```
✅ MySQL Database connected
✅ Database initialized successfully
🚀 Server running on port 5000
```

Test the API:
```powershell
curl http://localhost:5000/api/transactions?limit=5
```

---

## API Endpoints (Same as Before)

All endpoints remain unchanged, but now powered by MySQL:

### Get Transactions
```
GET /api/transactions?page=1&limit=10&region=North&sortBy=date&order=desc
```

### Get Filter Options
```
GET /api/filter-options
```

### Get Statistics
```
GET /api/stats?startDate=2024-01-01&endDate=2024-12-31
```

### Health Check
```
GET /health
```

---

## Performance Tips

### 1. Add More Indexes (if needed)
```sql
-- For frequently searched fields
CREATE INDEX idx_customer_name ON sales(customerName);
CREATE INDEX idx_product_name ON sales(productName);

-- For date range queries
CREATE INDEX idx_date_range ON sales(date);
```

### 2. Query Optimization
The `DatabaseService` uses parameterized queries to prevent SQL injection:
```javascript
// ✅ Safe - prevents SQL injection
query += ' WHERE customerName LIKE ?';
params.push(`%${searchTerm}%`);

// ❌ Unsafe - SQL injection risk
query += ` WHERE customerName LIKE '%${searchTerm}%'`;
```

### 3. Connection Pooling
The service uses a connection pool with 10 concurrent connections:
```javascript
connectionLimit: 10,  // Adjust based on traffic
queueLimit: 0         // Queue unlimited requests
```

---

## Troubleshooting

### Error: "connect ECONNREFUSED 127.0.0.1:3306"
**Solution:** MySQL is not running
```powershell
# Windows - Start MySQL service
net start MySQL80

# Or use MySQL Workbench: Click "Server" → "Startup Server"
```

### Error: "Access denied for user 'root'"
**Solution:** Check your password in `.env`
```env
DB_PASSWORD=your_actual_password_here
```

### Error: "Unknown database 'truestate_db'"
**Solution:** Create the database first:
```sql
CREATE DATABASE truestate_db;
```

### Error: "Table 'truestate_db.sales' doesn't exist"
**Solution:** Run the CREATE TABLE SQL from step 3

### Slow INSERT during migration
**Solution:** Increase batch size in `scripts/migrateToMySQL.js`:
```javascript
const batchSize = 1000;  // Insert 1000 records at once
```

---

## Reverting to CSV (if needed)

```powershell
cd D:\SDE_Intern\Backend\src
copy index-csv-backup.js index.js
copy controllers\salesController-csv.js controllers\salesController.js
npm start
```

---

## Next Steps

1. **Add user authentication** - Secure API with JWT tokens
2. **Add transactions** - Use `BEGIN/COMMIT/ROLLBACK` for multi-step operations
3. **Add audit logging** - Track who changed what and when
4. **Set up replication** - Backup to another MySQL server
5. **Use connection pooling** - Already implemented! ✅

---

## Cloud Database Alternatives

If you don't want to install MySQL locally:

| Service | Pros | Cost |
|---------|------|------|
| **AWS RDS** | Managed, auto-backups | $15-30/month |
| **DigitalOcean MySQL** | Simple, affordable | $15/month |
| **Google Cloud SQL** | Scalable, integrated | $15-60/month |
| **PlanetScale** | MySQL-compatible | Free tier available |

Just update your `.env` with the cloud database credentials.

---

## Summary

✅ CSV → MySQL migration complete!

**Before:**
- 1M records loaded into RAM on every startup
- Full table scan for every query
- Manual backups

**After:**
- Query-level filtering on the database
- Indexed searches (100x faster)
- Real-time data updates
- Easy backups and scalability

Your frontend doesn't change at all! Same API, better performance. 🚀

