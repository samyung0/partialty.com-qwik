export default (password: string, hash: string) => Bun.password.verify(password, hash);
