/**
 * MySQL Database Setup Script
 * Creates database and sales table
 * Run: node scripts/setupDatabase.js
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
  let connection;
  try {
    // Connect without specifying database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    console.log('✅ Connected to MySQL server');

    // Create database
    const dbName = process.env.DB_NAME || 'truestate_db';
    console.log(`📂 Creating database: ${dbName}`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`✅ Database created`);

    // Select database
    await connection.query(`USE ${dbName}`);

    // Create sales table
    console.log('📋 Creating sales table...');
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS sales (
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
      )
    `;
    await connection.query(createTableSQL);
    console.log('✅ Sales table created');

    await connection.end();
    console.log('\n✅ Database setup completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    if (error.message.includes('Access denied')) {
      console.log('\n⚠️  Database connection failed. Make sure:');
      console.log('   1. MySQL is running');
      console.log('   2. DB_USER and DB_PASSWORD in .env are correct');
      console.log('   3. MySQL root password is set (default: root or blank)');
    }
    throw error;
  }
}

setupDatabase();
