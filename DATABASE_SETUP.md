# Database Migration Guide: CSV to MySQL

This guide shows you how to replace the in-memory CSV data loader with a MySQL database.

## Step 1: Install MySQL Driver

```powershell
cd D:\SDE_Intern\Backend
npm install mysql2 dotenv
```

## Step 2: Create Environment Configuration

Create a `.env` file in `Backend/` folder:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=truestate_db
```

Replace `yourpassword` with your actual MySQL root password.

## Step 3: Create Database and Table

Open MySQL command line (or MySQL Workbench) and run:

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS truestate_db;
USE truestate_db;

-- Create sales table
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
  INDEX idx_customer_region (customerRegion),
  INDEX idx_gender (gender),
  INDEX idx_age (age),
  INDEX idx_category (productCategory),
  INDEX idx_payment (paymentMethod),
  INDEX idx_date (date)
);
```

## Step 4: Import CSV Data (Optional)

If you have your `sales.csv` file and want to bulk import it:

```sql
LOAD DATA LOCAL INFILE 'D:/SDE_Intern/Backend/data/sales.csv'
INTO TABLE sales
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;
```

Or use MySQL Workbench's table import wizard.

## Step 5: Use the New Database Service Files

The files below will be auto-generated in the Backend folder. They replace the CSV loader with database queries.

---

## Architecture Overview

**Old Flow (CSV):**
```
CSV File → loadSalesData() → In-Memory Array → SalesService → API
```

**New Flow (MySQL):**
```
MySQL Database ← Connection Pool → DatabaseService → SalesService → API
```

### Key Benefits of MySQL Over CSV:
- ✅ Query-level filtering (faster for large datasets)
- ✅ Indexing (O(log n) lookups instead of O(n) scans)
- ✅ Multi-user support with transaction handling
- ✅ Scalability (millions of rows without memory issues)
- ✅ Real-time data updates (no restart needed)
- ✅ Data integrity and validation at DB layer

---

## Next Steps

1. Install MySQL on your machine or use a cloud service (e.g., AWS RDS, DigitalOcean)
2. Create the `.env` file with your credentials
3. Replace the backend service files with the MySQL versions (see below)
4. Restart the backend server
5. Test the API endpoints

## Troubleshooting

**Connection Error:** Verify DB_HOST, DB_USER, DB_PASSWORD in `.env`

**Table Not Found:** Run the SQL commands above to create the table

**Port Already in Use:** Change DB_PORT if MySQL runs on a different port (default 3306)

**Large CSV Import Slow:** Use `LOAD DATA INFILE` instead of row-by-row inserts

