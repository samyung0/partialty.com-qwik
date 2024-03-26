import { createUser } from '../models/user.model';

describe('testing users', () => {
  it('should create, read and delete a user', async ({ integration }) => {
    const [user] = await integration.createNormalUser();
    expect(user).toBeDefined();

    const [readUser] = await integration.getUser(user.id);
    expect(readUser).toBeDefined();

    await integration.removeUser(user.id);
    const [readUserAfterDelete] = await integration.getUser(user.id);
    expect(readUserAfterDelete).toBeUndefined();
  });
  it('should throw an error - duplicate email', async ({ integration }) => {
    const [user] = await integration.createNormalUser();
    expect(user).toBeDefined();
    expect(() => createUser({ ...user, id: user.id + 'randomized' })).rejects.toThrow();
  });
});
