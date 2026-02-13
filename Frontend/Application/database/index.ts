import SQLiteModule from 'expo-sqlite';
import { SQLiteDB, SQLiteTransaction } from '../types/sqlite';

// Cast to bypass TS typing issues
const SQLite = SQLiteModule as any;
const db = SQLite.openDatabase('calculator.db') as SQLiteDB;

export const initDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: SQLiteTransaction) => {
      // 1. Devices
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS devices (
          id TEXT PRIMARY KEY,
          created_at TEXT
        );
      `);

      // 2. Publishers
      tx.executeSql(`
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
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS calculators (
          id TEXT PRIMARY KEY,
          publisher_id TEXT,
          device_id TEXT,
          type TEXT CHECK (type IN ('simple','advanced')),
          title TEXT,
          description TEXT,
          published INTEGER DEFAULT 0,
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
      tx.executeSql(`
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
      tx.executeSql(`
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
      tx.executeSql(`
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
      tx.executeSql(`
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
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS calculator_usage (
          calculator_id TEXT,
          device_id TEXT,
          first_used_at TEXT,
          PRIMARY KEY (calculator_id, device_id)
        );
      `);

    },
    (err) => reject(err),  // Transaction error
    () => resolve()         // Transaction success
    );
  });
};

export default db;
