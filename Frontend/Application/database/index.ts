import { openDatabaseAsync } from 'expo-sqlite';

let db: any = null;
let isInitialized = false;

export const getDatabase = async () => {
  if (!db || !isInitialized) {
    await initDatabase();
  }
  return db;
};

export const initDatabase = async (): Promise<void> => {
  if (isInitialized && db) {
    return; // Already initialized
  }
  
  try {
    db = await openDatabaseAsync('calculator.db');
    isInitialized = true;
    
    // 1. Devices
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS devices (
        id TEXT PRIMARY KEY,
        name TEXT,
        age INTEGER,
        speciality TEXT,
        level TEXT,
        university TEXT,
        created_at TEXT
      );
    `);

    // 2. Publishers
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS publishers (
        id TEXT PRIMARY KEY,
        device_id TEXT,
        name TEXT,
        email TEXT UNIQUE,
        email_verified INTEGER DEFAULT 0,
        created_at TEXT,
        verified_at TEXT
      );
    `);

    // 3. Calculators
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS calculators (
        id TEXT PRIMARY KEY,
        publisher_id TEXT,
        device_id TEXT,
        type TEXT CHECK (type IN ('simple','advanced')),
        title TEXT,
        description TEXT,
        published INTEGER DEFAULT 0,
        speciality TEXT,
        level TEXT,
        university_name TEXT,
        ratings_count INTEGER DEFAULT 0,
        ratings_avg REAL DEFAULT 0,
        usage_count INTEGER DEFAULT 0,
        created_at TEXT,
        updated_at TEXT,
        deleted_at TEXT,
        synced INTEGER DEFAULT 0
      );
    `);

    // 4. Semesters
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS semesters (
        id TEXT PRIMARY KEY,
        calculator_id TEXT,
        name TEXT CHECK (name IN ('s1','s2')),
        created_at TEXT,
        updated_at TEXT,
        deleted_at TEXT,
        synced INTEGER DEFAULT 0,
        UNIQUE(calculator_id, name)
      );
    `);

    // 5. Units
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS units (
        id TEXT PRIMARY KEY,
        semester_id TEXT,
        title TEXT,
        created_at TEXT,
        updated_at TEXT,
        deleted_at TEXT,
        synced INTEGER DEFAULT 0
      );
    `);

    // 6. Modules
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS modules (
        id TEXT PRIMARY KEY,
        semester_id TEXT,
        unit_id TEXT,
        name TEXT,
        coeff INTEGER DEFAULT 1,
        has_td INTEGER DEFAULT 0,
        has_tp INTEGER DEFAULT 0,
        credit INTEGER,
        weight_exam REAL,
        weight_td REAL,
        weight_tp REAL,
        created_at TEXT,
        updated_at TEXT,
        deleted_at TEXT,
        synced INTEGER DEFAULT 0
      );
    `);

    // 7. Calculator ratings
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS calculator_ratings (
        id TEXT PRIMARY KEY,
        calculator_id TEXT,
        device_id TEXT,
        rating INTEGER CHECK (rating BETWEEN 1 AND 5),
        created_at TEXT,
        updated_at TEXT,
        synced INTEGER DEFAULT 0,
        UNIQUE(calculator_id, device_id)
      );
    `);

    // 8. Calculator usage
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS calculator_usage (
        calculator_id TEXT,
        device_id TEXT,
        first_used_at TEXT,
        PRIMARY KEY (calculator_id, device_id)
      );
    `);
  } catch (err) {
    throw err;
  }
};

export const clearDatabase = async (): Promise<void> => {
  try {
    await db.execAsync(`
      DELETE FROM calculator_usage;
      DELETE FROM calculator_ratings;
      DELETE FROM modules;
      DELETE FROM units;
      DELETE FROM semesters;
      DELETE FROM calculators;
      DELETE FROM publishers;
      DELETE FROM devices;
    `);
  } catch (err) {
    console.error('Failed to clear database:', err);
    throw err;
  }
};

/**
 * Debug utility: Log all SQLite database tables and their schemas
 * This is useful for debugging database structure and contents
 */
export const logAllDatabaseTables = async (): Promise<void> => {
  try {
    const database = await getDatabase();
    if (!database) {
      console.error('Database not initialized');
      return;
    }

    // Get all table names from sqlite_master
    const tables = await database.getAllAsync(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
    );

    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║       SQLITE DATABASE STRUCTURE            ║');
    console.log('╚════════════════════════════════════════════╝\n');

    if (!tables || tables.length === 0) {
      console.log('No tables found in database\n');
      return;
    }

    console.log(`Total tables: ${tables.length}\n`);

    // Process each table
    for (const table of tables) {
      const tableName = table.name;
      
      // Get table info (columns, types, constraints)
      const tableInfo = await database.getAllAsync(`PRAGMA table_info(${tableName})`);
      
      // Get row count
      const rowCountResult = await database.getFirstAsync(
        `SELECT COUNT(*) as count FROM ${tableName}`
      );
      const rowCount = rowCountResult?.count || 0;

      // Get indexes
      const indexes = await database.getAllAsync(
        `PRAGMA index_list(${tableName})`
      );

      // Get foreign keys
      const foreignKeys = await database.getAllAsync(
        `PRAGMA foreign_key_list(${tableName})`
      );

      // Print table header
      console.log(`┌─ TABLE: ${tableName} (${rowCount} rows) ${'─'.repeat(40 - tableName.length)}`);

      // Print columns
      if (tableInfo && tableInfo.length > 0) {
        console.log('│ COLUMNS:');
        tableInfo.forEach((col: any, idx: number) => {
          const isLast = idx === tableInfo.length - 1;
          const prefix = isLast ? '└─' : '├─';
          const notnull = col.notnull ? '[NOT NULL]' : '[NULLABLE]';
          const pk = col.pk ? '[PRIMARY KEY]' : '';
          console.log(`│   ${prefix} ${col.name} (${col.type}) ${notnull} ${pk}`);
        });
      }

      // Print indexes if any
      if (indexes && indexes.length > 0) {
        console.log('│');
        console.log('│ INDEXES:');
        indexes.forEach((idx: any) => {
          console.log(`│   ├─ ${idx.name} ${idx.unique ? '[UNIQUE]' : '[NON-UNIQUE]'}`);
        });
      }

      // Print foreign keys if any
      if (foreignKeys && foreignKeys.length > 0) {
        console.log('│');
        console.log('│ FOREIGN KEYS:');
        foreignKeys.forEach((fk: any) => {
          console.log(`│   ├─ ${fk.from} → ${fk.table}(${fk.to})`);
        });
      }

      console.log('└' + '─'.repeat(52) + '\n');
    }

    console.log('╔════════════════════════════════════════════╗');
    console.log('║       END OF DATABASE STRUCTURE            ║');
    console.log('╚════════════════════════════════════════════╝\n');
  } catch (error: any) {
    console.error('Error logging database tables:', error);
    console.error('Error details:', error?.message || JSON.stringify(error));
  }
};

/**
 * Debug utility: Log all data in a specific table
 */
export const logTableData = async (tableName: string, limit: number = 100): Promise<void> => {
  try {
    const database = await getDatabase();
    if (!database) {
      console.error('Database not initialized');
      return;
    }

    const data = await database.getAllAsync(
      `SELECT * FROM ${tableName} LIMIT ?`,
      [limit]
    );

    console.log(`\n📊 TABLE: ${tableName}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Total rows shown: ${data?.length || 0}\n`);
    
    if (data && data.length > 0) {
      console.table(data);
    } else {
      console.log('No data in table');
    }
    console.log('');
  } catch (error: any) {
    console.error(`Error logging table ${tableName}:`, error);
  }
};
