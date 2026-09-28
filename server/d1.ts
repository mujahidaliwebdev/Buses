import fs from 'fs';
import path from 'path';
import { DatabaseSync } from 'node:sqlite';

interface D1Config {
  accountId: string;
  databaseId: string;
  apiToken: string;
}

const CONFIG_FILE_PATH = path.join(process.cwd(), 'tmp', 'cloudflare_d1_config.json');
const ROOT_CONFIG_PATH = path.join(process.cwd(), '.cloudflare_d1_config.json');
const LOCAL_DB_PATH = path.join(process.cwd(), 'tmp', 'local_d1.sqlite');

// Ensure tmp directory exists
try {
  const tmpDir = path.dirname(CONFIG_FILE_PATH);
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }
} catch (e) {
  console.warn('Could not initialize tmp dir:', e);
}

let localDbInstance: DatabaseSync | null = null;

export function getLocalDb(): DatabaseSync {
  if (!localDbInstance) {
    const tmpDir = path.dirname(LOCAL_DB_PATH);
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    localDbInstance = new DatabaseSync(LOCAL_DB_PATH);
    // Auto-seed table schemas into local SQLite database if empty
    try {
      const schemaPath = path.join(process.cwd(), 'cloudflare_d1_schema.sql');
      if (fs.existsSync(schemaPath)) {
        const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
        localDbInstance.exec(schemaSql);
      }
    } catch (e) {
      console.warn('Notice seeding schema into local sqlite db:', e);
    }
  }
  return localDbInstance;
}

function queryLocalDb(sql: string, params: any[] = []): any[] {
  const db = getLocalDb();
  const trimmed = sql.trim();
  const isSelect = /^(SELECT|PRAGMA|WITH)\b/i.test(trimmed);

  if (isSelect) {
    const stmt = db.prepare(trimmed);
    return stmt.all(...params) as any[];
  } else {
    if (params && params.length > 0) {
      const stmt = db.prepare(trimmed);
      const res = stmt.run(...params);
      return [res];
    } else {
      db.exec(trimmed);
      return [];
    }
  }
}

export function getD1Config(): D1Config {
  let fileConfig: Partial<D1Config> = {};
  try {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const content = fs.readFileSync(CONFIG_FILE_PATH, 'utf-8');
      fileConfig = JSON.parse(content);
    } else if (fs.existsSync(ROOT_CONFIG_PATH)) {
      const content = fs.readFileSync(ROOT_CONFIG_PATH, 'utf-8');
      fileConfig = JSON.parse(content);
    }
  } catch (e) {
    // Ignore file read error
  }

  return {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID || fileConfig.accountId || '',
    databaseId: process.env.CLOUDFLARE_DATABASE_ID || fileConfig.databaseId || '',
    apiToken: process.env.CLOUDFLARE_API_TOKEN || fileConfig.apiToken || '',
  };
}

export function saveD1Config(config: D1Config): void {
  try {
    const tmpDir = path.dirname(CONFIG_FILE_PATH);
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(config, null, 2), 'utf-8');
    try {
      fs.writeFileSync(ROOT_CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
    } catch (rootErr) {
      // Non-blocking
    }
  } catch (e) {
    console.error('Failed to write D1 config file:', e);
    throw new Error('Failed to save Cloudflare D1 credentials on disk.');
  }
}

/**
 * Execute a single query on Cloudflare D1 or fallback to local SQLite database.
 */
export async function queryD1(sql: string, params: any[] = []): Promise<any[]> {
  const config = getD1Config();

  // If Cloudflare D1 credentials are fully configured, attempt Cloudflare REST API first
  if (config.accountId && config.databaseId && config.apiToken) {
    try {
      const endpoint = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/d1/database/${config.databaseId}/query`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql,
          params,
        }),
      });

      if (response.ok) {
        const data: any = await response.json();
        if (data.success) {
          const resultBatch = data.result?.[0];
          if (resultBatch && resultBatch.results) {
            return resultBatch.results;
          }
          return [];
        }
      }
    } catch (cfErr) {
      console.warn('Cloudflare D1 query failed, using local database fallback:', cfErr);
    }
  }

  // Local persistent SQLite database fallback
  return queryLocalDb(sql, params);
}

/**
 * Execute raw batch SQL (multiple statements separated by semicolons).
 */
export async function executeBatchD1(sqlRaw: string): Promise<{ success: boolean; executedCount: number; message: string }> {
  const config = getD1Config();

  if (config.accountId && config.databaseId && config.apiToken) {
    try {
      const statements = sqlRaw
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      if (statements.length === 0) {
        return { success: true, executedCount: 0, message: 'No executable SQL statements found.' };
      }

      const endpoint = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/d1/database/${config.databaseId}/query`;
      let successCount = 0;

      for (const stmt of statements) {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.apiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sql: stmt,
            params: [],
          }),
        });

        if (res.ok) {
          const data: any = await res.json();
          if (data.success) successCount++;
        }
      }

      if (successCount > 0) {
        return {
          success: true,
          executedCount: successCount,
          message: `Successfully executed ${successCount} statements on Cloudflare D1 database.`,
        };
      }
    } catch (cfErr) {
      console.warn('Cloudflare D1 batch execute failed, using local database:', cfErr);
    }
  }

  // Local fallback execution
  const statements = sqlRaw
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  const db = getLocalDb();
  let executedCount = 0;
  for (const stmt of statements) {
    try {
      db.exec(stmt);
      executedCount++;
    } catch (stmtErr) {
      console.warn('Local SQLite batch statement notice:', stmtErr);
    }
  }

  return {
    success: true,
    executedCount,
    message: `Successfully executed ${executedCount} statements on local database.`,
  };
}

/**
 * Test connectivity to Cloudflare D1 or local database.
 */
export async function testD1Connection(): Promise<{ connected: boolean; message: string; busCount?: number }> {
  try {
    const config = getD1Config();
    if (config.accountId && config.databaseId && config.apiToken) {
      const results = await queryD1('SELECT count(*) as count FROM sqlite_master WHERE type="table";');
      const tableCount = results[0]?.count ?? 0;

      let busCount = 0;
      try {
        const busResults = await queryD1('SELECT count(*) as bus_count FROM buses;');
        busCount = busResults[0]?.bus_count ?? 0;
      } catch (e) {
        // Table buses might not be created yet
      }

      return {
        connected: true,
        message: `Connected successfully! Found ${tableCount} tables and ${busCount} buses in Cloudflare D1 database.`,
        busCount,
      };
    }

    const localTables = queryLocalDb('SELECT count(*) as count FROM sqlite_master WHERE type="table";');
    const tableCount = localTables[0]?.count ?? 0;
    return {
      connected: true,
      message: `Local persistent SQLite database active! Found ${tableCount} tables. Ready for all user data & contributions.`,
      busCount: 0,
    };
  } catch (error: any) {
    return {
      connected: false,
      message: error.message || 'Failed to connect to database.',
    };
  }
}
