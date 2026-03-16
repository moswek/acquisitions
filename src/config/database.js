import 'dotenv/config';

let db, sql;

if (process.env.NODE_ENV === 'development') {
  const pkg = await import('pg');
  const { drizzle } = await import('drizzle-orm/node-postgres');
  const pool = new pkg.default.Pool({
    connectionString: process.env.DATABASE_URL,
  });
  db = drizzle(pool);
} else {
  const { neon } = await import('@neondatabase/serverless');
  const { drizzle } = await import('drizzle-orm/neon-http');
  sql = neon(process.env.DATABASE_URL);
  db = drizzle(sql);
}

export { db, sql };
