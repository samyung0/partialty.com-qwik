import jwt from 'jsonwebtoken';
import path from 'node:path';

export default async (id: string) => {
  const file = Bun.file(path.resolve(import.meta.dir, '../keys/partialty-com-dev.2024-01-14.private-key.pem'));
  const key = await file.text();
  return jwt.sign({ iat: Math.floor(Date.now() / 1000) - 30 }, key, {
    algorithm: 'RS256',
    issuer: id,
    expiresIn: 5 * 60,
  });
};
