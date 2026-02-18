/**
 * Database Debug Script
 * 
 * Usage in your component:
 * 
 * import { debugDatabase } from '@/database/debugDatabase';
 * 
 * // In a useEffect or button handler:
 * const handleDebug = async () => {
 *   await debugDatabase.logAllTables();
 *   await debugDatabase.logTable('calculators');
 *   await debugDatabase.logTable('semesters');
 *   await debugDatabase.logStats();
 * };
 */

import { logAllDatabaseTables, logTableData, getDatabase } from './index';

export const debugDatabase = {
  /**
   * Log all tables with their structure
   */
  logAllTables: async () => {
    console.log('\n🔍 Starting database debug...\n');
    await logAllDatabaseTables();
  },

  /**
   * Log data from a specific table
   */
  logTable: async (tableName: string, limit: number = 100) => {
    await logTableData(tableName, limit);
  },

  /**
   * Log quick statistics about all tables
   */
  logStats: async () => {
    try {
      const db = await getDatabase();
      if (!db) {
        console.error('Database not initialized');
        return;
      }

      const tables = await db.getAllAsync(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
      );

      console.log('\n📈 DATABASE STATISTICS');
      console.log('═══════════════════════════════════════\n');

      let totalRows = 0;

      for (const table of tables) {
        const result = await db.getFirstAsync(
          `SELECT COUNT(*) as count FROM ${table.name}`
        );
        const count = result?.count || 0;
        totalRows += count;
        console.log(`  ${table.name.padEnd(25)} : ${count} rows`);
      }

      console.log('\n  ' + '─'.repeat(35));
      console.log(`  Total rows across all tables: ${totalRows}\n`);
    } catch (error) {
      console.error('Error getting statistics:', error);
    }
  },

  /**
   * Clear all data from all tables (use with caution!)
   */
  clearAllTables: async () => {
    try {
      const db = await getDatabase();
      if (!db) {
        console.error('Database not initialized');
        return;
      }

      console.log('\n⚠️  CLEARING ALL TABLES...\n');

      const tables = await db.getAllAsync(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name DESC"
      );

      for (const table of tables) {
        await db.runAsync(`DELETE FROM ${table.name}`);
        console.log(`  ✓ Cleared ${table.name}`);
      }

      console.log('\n✅ All tables cleared!\n');
    } catch (error) {
      console.error('Error clearing tables:', error);
    }
  },

  /**
   * Export database as JSON (for backup/inspection)
   */
  exportAsJSON: async () => {
    try {
      const db = await getDatabase();
      if (!db) {
        console.error('Database not initialized');
        return;
      }

      const tables = await db.getAllAsync(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
      );

      const backup: any = {};

      for (const table of tables) {
        const data = await db.getAllAsync(`SELECT * FROM ${table.name}`);
        backup[table.name] = data || [];
      }

      console.log('\n📦 DATABASE EXPORT (JSON)\n');
      console.log(JSON.stringify(backup, null, 2));
      console.log('');

      return backup;
    } catch (error) {
      console.error('Error exporting database:', error);
    }
  },

  /**
   * Quick health check
   */
  healthCheck: async () => {
    try {
      console.log('\n🏥 DATABASE HEALTH CHECK\n');

      const db = await getDatabase();
      if (!db) {
        console.log('❌ Database not initialized\n');
        return false;
      }

      console.log('✅ Database connection: OK');

      // Check all tables exist
      const tables = [
        'devices',
        'publishers',
        'calculators',
        'semesters',
        'units',
        'modules',
        'calculator_ratings',
        'calculator_usage',
      ];

      for (const table of tables) {
        try {
          await db.getFirstAsync(`SELECT COUNT(*) FROM ${table} LIMIT 1`);
          console.log(`✅ Table ${table}: OK`);
        } catch {
          console.log(`❌ Table ${table}: MISSING`);
        }
      }

      console.log('\n✅ Health check complete!\n');
      return true;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  },
};
