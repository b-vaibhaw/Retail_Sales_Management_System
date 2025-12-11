/**
 * CSV to SQLite Migration Script
 * Reads CSV and inserts all records into SQLite database
 * Run: node scripts/migrateToSQLite.js
 */

const fs = require('fs');
const path = require('path');
const SQLiteDatabaseService = require('../src/services/sqliteDatabaseService');

async function migrateData() {
  try {
    // Initialize database
    const db = new SQLiteDatabaseService();
    await db.initialize();

    // Read CSV file
    const csvPath = path.join(__dirname, '../data/sales.csv');
    if (!fs.existsSync(csvPath)) {
      console.error('❌ CSV file not found at:', csvPath);
      return;
    }

    console.log('📂 Reading CSV file...');
    const csvData = fs.readFileSync(csvPath, 'utf8');
    const lines = csvData.split('\n').filter(l => l.trim());

    // Parse headers
    let headers = [];
    const headerLine = lines[0];
    const headerRegex = /"([^"]*)"|([^,]+)/g;
    let match;
    while ((match = headerRegex.exec(headerLine)) !== null) {
      const header = (match[1] || match[2]).trim();
      const camelCase = header.split(' ').map((word, i) =>
        i === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join('');
      headers.push(camelCase);
    }

    console.log(`✅ Found ${lines.length - 1} records to import`);

    // Parse CSV rows
    const records = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;

      const fields = [];
      const lineRegex = /"([^"]*)"|([^,]+)/g;
      let fieldMatch;
      while ((fieldMatch = lineRegex.exec(line)) !== null) {
        const field = (fieldMatch[1] || fieldMatch[2]).trim();
        fields.push(field);
      }

      const record = {};
      for (let j = 0; j < headers.length; j++) {
        const value = fields[j] || '';
        record[headers[j]] = value === '' || value === null ? null : value;
      }

      records.push(record);

      // Show progress every 10000 records
      if (i % 10000 === 0) {
        console.log(`⏳ Processed ${i} records...`);
      }
    }

    console.log(`\n📥 Inserting ${records.length} records into SQLite...`);
    
    // Insert in batches
    const batchSize = 1000;
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      await db.insertBulk(batch);
      console.log(`✅ Inserted ${Math.min(i + batchSize, records.length)} / ${records.length}`);
    }

    console.log(`\n✅ Migration completed successfully!`);
    console.log(`📊 Total records inserted: ${records.length}`);

    await db.close();
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

migrateData();
