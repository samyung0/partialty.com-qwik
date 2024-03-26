import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import path from 'node:path';
import schemaExport from './schemaExport';
dotenv.config({ path: '../.env' });
dotenv.config({ path: '../.env.local' });

if (!Bun.env.TURSO_URL || !Bun.env.TURSO_TOKEN) {
  throw Error('Env variables error!');
}

const turso = createClient({ url: Bun.env.TURSO_URL, authToken: Bun.env.TURSO_TOKEN });
const drizzleClient = drizzle(turso, { schema: schemaExport });

(async () => {
  await migrate(drizzleClient, {
    migrationsFolder: path.resolve(import.meta.dir, './drizzle_dev'),
  });
  console.log('Successfully migrated dev db.');
})();
