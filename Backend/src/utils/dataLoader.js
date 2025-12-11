const fs = require('fs');
const path = require('path');

/**
 * Load sales data from CSV file
 * Place your sales.csv file in backend/data/ folder
 */
function loadSalesData() {
  try {
    // Try multiple possible paths for CSV file
    const possiblePaths = [
      path.join(__dirname, '../../data/sales.csv'),
      path.join(__dirname, '../data/sales.csv'),
      path.join(process.cwd(), 'data/sales.csv'),
      path.join(process.cwd(), 'backend/data/sales.csv')
    ];

    let dataPath = null;
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        dataPath = p;
        break;
      }
    }

    if (!dataPath) {
      console.warn('⚠️  Sales data file not found. Using empty dataset.');
      console.log('📁 Expected locations:', possiblePaths);
      return [];
    }

    console.log(`📂 Loading data from: ${dataPath}`);
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = parseCSV(rawData);

    // Validate data structure
    if (!Array.isArray(data)) {
      throw new Error('Parsed sales data must be an array');
    }

    console.log(`✅ Loaded ${data.length} records from CSV`);
    return data;
  } catch (error) {
    console.error('❌ Error loading sales data:', error.message);
    return [];
  }
}

/**
 * Convert a string to camelCase
 * "Customer Name" => "customerName"
 */
function toCamelCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      if (index === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join('');
}

/**
 * Parse CSV data into array of objects
 * Handles quoted fields and basic CSV edge cases
 */
function parseCSV(csvString) {
  const lines = csvString.split('\n');
  
  if (lines.length === 0) {
    return [];
  }

  // Parse headers and convert to camelCase
  const headers = parseCSVLine(lines[0]).map(toCamelCase);
  
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = parseCSVLine(line);
    const obj = {};
    
    headers.forEach((header, index) => {
      let value = values[index] || '';
      
      // Try to convert to appropriate type
      if (value !== '') {
        // Check if it's a number
        if (!isNaN(value) && value !== '') {
          value = Number(value);
        }
      }
      
      obj[header] = value;
    });
    
    data.push(obj);
  }
  
  return data;
}

/**
 * Parse a single CSV line handling quoted fields
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

module.exports = { 
  loadSalesData,
  parseCSV
};