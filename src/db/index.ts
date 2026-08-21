import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

type Db = NodePgDatabase<Record<string, never>>;

const globalForDb = globalThis as typeof globalThis & {
  __helwPool?: Pool;
  __helwDb?: Db;
};

function createPool(): Pool {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is not set. Add it to your environment (locally in .env, or in Vercel project settings) to enable the CRM APIs. The marketing site works without it."
    );
  }
  const pool = globalForDb.__helwPool ?? new Pool({ connectionString: databaseUrl });
  if (process.env.NODE_ENV !== "production") {
    globalForDb.__helwPool = pool;
  }
  return pool;
}

/**
 * Lazy database singleton: the connection is created on first actual query
 * instead of at import time, so `next build` and the marketing site work
 * even when DATABASE_URL is not configured yet.
 */
export const db: Db = new Proxy({} as Db, {
  get(_target, prop) {
    globalForDb.__helwDb ??= drizzle(createPool());
    const value = Reflect.get(globalForDb.__helwDb, prop);
    return typeof value === "function" ? value.bind(globalForDb.__helwDb) : value;
  },
});
