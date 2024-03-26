import { eq } from 'drizzle-orm';
import { NewProfile, profiles } from '../../drizzle_turso/schema/profiles';
import { drizzleClient } from '../../setup/drizzle';

export const createUser = (user: NewProfile) => drizzleClient.insert(profiles).values(user).returning();

export const getUser = (userId: string) => drizzleClient.select().from(profiles).where(eq(profiles.id, userId));

export const removeUser = (userId: string) => drizzleClient.delete(profiles).where(eq(profiles.id, userId)).returning();
