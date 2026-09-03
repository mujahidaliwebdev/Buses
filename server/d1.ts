import fs from 'fs';
import path from 'path';

interface D1Config {
  accountId: string;
  databaseId: string;
  apiToken: string;
}

const CONFIG_FILE_PATH = path.join(process.cwd(), 'tmp', 'cloudflare_d1_config.json');
const ROOT_CONFIG_PATH = path.join(process.cwd(), '.cloudflare_d1_config.json');

// Ensure tmp directory exists
try {
  const tmpDir = path.dirname(CONFIG_FILE_PATH);
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }
} catch (e) {
  console.warn('Could not initialize tmp dir:', e);
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
 * Execute a single query on Cloudflare D1 via the Cloudflare REST API.
 */
export async function queryD1(sql: string, params: any[] = []): Promise<any[]> {
  const config = getD1Config();

  if (!config.accountId || !config.databaseId || !config.apiToken) {
    throw new Error('Cloudflare D1 credentials not fully configured (Account ID, Database ID, and API Token required).');
  }

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

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cloudflare API HTTP error (${response.status}): ${errorText}`);
  }

  const data: any = await response.json();

  if (!data.success) {
    const errMsg = data.errors?.map((err: any) => err.message).join(', ') || 'Unknown Cloudflare D1 error';
    throw new Error(`Cloudflare D1 Query Failed: ${errMsg}`);
  }

  // The first result element contains results array
  const resultBatch = data.result?.[0];
  if (resultBatch && resultBatch.results) {
    return resultBatch.results;
  }

  return [];
}

/**
 * Execute raw batch SQL (multiple statements separated by semicolons).
 */
export async function executeBatchD1(sqlRaw: string): Promise<{ success: boolean; executedCount: number; message: string }> {
  const config = getD1Config();

  if (!config.accountId || !config.databaseId || !config.apiToken) {
    throw new Error('Cloudflare D1 credentials not configured.');
  }

  // Split statements into clean non-empty chunks
  const statements = sqlRaw
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  if (statements.length === 0) {
    return { success: true, executedCount: 0, message: 'No executable SQL statements found.' };
  }

  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/d1/database/${config.databaseId}/query`;

  // We can execute them in sequential chunks or as a single batch
  let successCount = 0;
  
  // Cloudflare D1 query endpoint allows single SQL string with multiple statements or one by one
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

    if (!res.ok) {
      const errTxt = await res.text();
      throw new Error(`Batch execution failed at statement "${stmt.substring(0, 60)}...": ${errTxt}`);
    }

    const data: any = await res.json();
    if (!data.success) {
      const errMsg = data.errors?.map((err: any) => err.message).join(', ') || 'Error executing statement';
      throw new Error(`Failed statement: ${errMsg}`);
    }
    successCount++;
  }

  return {
    success: true,
    executedCount: successCount,
    message: `Successfully executed ${successCount} statements on Cloudflare D1 database.`,
  };
}

/**
 * Test connectivity to Cloudflare D1.
 */
export async function testD1Connection(): Promise<{ connected: boolean; message: string; busCount?: number }> {
  try {
    const config = getD1Config();
    if (!config.accountId || !config.databaseId || !config.apiToken) {
      return {
        connected: false,
        message: 'Credentials missing: Account ID, Database ID, and API Token are required.',
      };
    }

    // Try a simple query to see if database exists and is reachable
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
  } catch (error: any) {
    return {
      connected: false,
      message: error.message || 'Failed to connect to Cloudflare D1.',
    };
  }
}
