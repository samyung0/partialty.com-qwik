export default (password: string) => Bun.password.hash(password);
