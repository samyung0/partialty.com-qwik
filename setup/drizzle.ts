import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

const client = createClient({
  url: 'file:local.db',
});

export const tursoClient = client;
export const drizzleClient = drizzle(client);
