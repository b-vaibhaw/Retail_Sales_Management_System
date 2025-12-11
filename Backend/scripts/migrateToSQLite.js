/**
 * CSV to SQLite Migration Script (streaming, limited)
 * - Processes only the first LIMIT rows (default 100000)
 * - Reads CSV line-by-line (no full-file load)
 * - Inserts into SQLite in batches for memory-efficiency
 *
 * Run:
 *   node scripts/migrateToSQLite.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const SQLiteDatabaseService = require('../src/services/sqliteDatabaseService');

async function migrateData() {
  try {
    // SETTINGS
    const LIMIT = 100000;   // only first 1 lakh rows
    const BATCH_SIZE = 1000; // insert batch size

    // Initialize database
    const db = new SQLiteDatabaseService();
    await db.initialize();

    // CSV path
    const csvPath = path.join(__dirname, '../data/sales.csv');
    if (!fs.existsSync(csvPath)) {
      console.error('❌ CSV file not found at:', csvPath);
      return;
    }

    console.log('📂 Streaming CSV file...');
    console.log(`📌 Limiting to first ${LIMIT} rows (excluding header)`);

    const fileStream = fs.createReadStream(csvPath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    // header parsing helpers
    const headerRegex = /"([^"]*)"|([^,]+)/g;
    const lineRegex = /"([^"]*)"|([^,]+)/g;

    let headers = [];
    let isFirstLine = true;

    let processed = 0;     // number of data rows processed (not counting header)
    let buffer = [];       // current batch buffer

    // iterate lines so we can await inserts inside loop
    for await (const rawLine of rl) {
      // stop if we've reached LIMIT
      if (processed >= LIMIT) break;

      const line = rawLine;

      // skip empty lines
      if (!line || !line.trim()) {
        // still need to handle header if file begins with blank lines
        if (isFirstLine) continue;
        else continue;
      }

      // parse header line
      if (isFirstLine) {
        isFirstLine = false;
        headers = [];
        let match;
        headerRegex.lastIndex = 0;
        while ((match = headerRegex.exec(line)) !== null) {
          const header = (match[1] || match[2]).trim();
          // convert header to camelCase (mimic your prior code)
          const camelCase = header.split(' ').map((word, i) =>
            i === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          ).join('');
          headers.push(camelCase);
        }

        if (!headers.length) {
          throw new Error('Failed to parse header line (no headers found).');
        }

        // header parsed, continue to next line
        continue;
      }

      // parse data row
      const fields = [];
      let fieldMatch;
      lineRegex.lastIndex = 0;
      while ((fieldMatch = lineRegex.exec(line)) !== null) {
        const field = (fieldMatch[1] || fieldMatch[2]).trim();
        fields.push(field);
      }

      const record = {};
      for (let j = 0; j < headers.length; j++) {
        const value = fields[j] ?? '';
        record[headers[j]] = (value === '' || value === null) ? null : value;
      }

      buffer.push(record);
      processed++;

      // progress log every 10000 processed rows
      if (processed % 10000 === 0) {
        console.log(`⏳ Processed ${processed} records...`);
      }

      // if buffer full, insert and clear buffer
      if (buffer.length >= BATCH_SIZE) {
        await db.insertBulk(buffer);
        console.log(`✅ Inserted ${processed} / ${Math.min(LIMIT, processed)} (batch)`);
        buffer = [];
      }
    } // end for-await-of

    // insert any remaining buffer
    if (buffer.length > 0) {
      await db.insertBulk(buffer);
      console.log(`✅ Inserted final ${buffer.length} records`);
      buffer = [];
    }

    console.log(`\n✅ Migration completed successfully!`);
    console.log(`📊 Total records inserted: ${Math.min(processed, LIMIT)}`);

    await db.close();
    fileStream.close?.();
  } catch (error) {
    console.error('❌ Migration failed:', error.message || error);
    process.exit(1);
  }
}

migrateData();
