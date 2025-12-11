/**
 * CSV to MySQL Migration Script
 * 
 * This script reads the CSV file and inserts all records into MySQL
 * Run: node scripts/migrateToMySQL.js
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrateData() {
  let connection;
  try {
    // Connect to MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'truestate_db'
    });

    console.log('✅ Connected to MySQL');

    // Read CSV file
    const csvPath = path.join(__dirname, '../data/sales.csv');
    if (!fs.existsSync(csvPath)) {
      console.error('❌ CSV file not found at:', csvPath);
      console.error('   Expected path:', csvPath);
      return;
    }

    const csvData = fs.readFileSync(csvPath, 'utf8');
    const lines = csvData.split('\n').filter(l => l.trim());
    
    // Parse headers - handle quoted fields and spaces
    let headers = [];
    const headerLine = lines[0];
    const headerRegex = /"([^"]*)"|([^,]+)/g;
    let match;
    while ((match = headerRegex.exec(headerLine)) !== null) {
      const header = (match[1] || match[2]).trim();
      // Convert to camelCase
      const camelCase = header.split(' ').map((word, i) => 
        i === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join('');
      headers.push(camelCase);
    }

    console.log(`📂 Found ${lines.length - 1} rows to import`);

    // Prepare batch insert
    const batchSize = 500;
    let insertedCount = 0;

    for (let i = 1; i < lines.length; i += batchSize) {
      const batch = lines.slice(i, Math.min(i + batchSize, lines.length));
      const values = [];

      for (const line of batch) {
        if (!line.trim()) continue;

        // Parse CSV line properly (handle quoted fields)
        const fields = [];
        const lineRegex = /"([^"]*)"|([^,]+)/g;
        let fieldMatch;
        while ((fieldMatch = lineRegex.exec(line)) !== null) {
          const field = (fieldMatch[1] || fieldMatch[2]).trim();
          fields.push(field);
        }

        const row = [];
        for (let j = 0; j < headers.length; j++) {
          const value = fields[j] || null;
          row.push(value === '' || value === null ? null : value);
        }

        values.push(row);
      }

      if (values.length === 0) continue;

      // Build multi-row INSERT
      const placeholders = values.map(() => '(' + headers.map(() => '?').join(',') + ')').join(',');
      const flatValues = values.flat();
      const query = `INSERT INTO sales (${headers.join(',')}) VALUES ${placeholders}`;

      try {
        await connection.query(query, flatValues);
        insertedCount += values.length;
        console.log(`✅ Inserted ${insertedCount} records...`);
      } catch (error) {
        console.error('❌ Insert error:', error.message);
      }
    }

    console.log(`\n✅ Migration complete! Inserted ${insertedCount} records.`);

    // Verify
    const [result] = await connection.query('SELECT COUNT(*) as count FROM sales');
    console.log(`📊 Total records in database: ${result[0].count}`);

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

migrateData();
