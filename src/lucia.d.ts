/// <reference types="lucia" />

import type { NewProfile } from '../drizzle_turso/schema/profiles.js';
import type { New_user_session } from '../drizzle_turso/schema/user_session.js';

declare namespace Lucia {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  type Auth = import('./auth/lucia.js').Auth;
  type DatabaseUserAttributes = Omit<NewProfile, 'id'>;
  type DatabaseSessionAttributes = Omit<New_user_session, 'id'>;
}
