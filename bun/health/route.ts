import Elysia from 'elysia';

const app = new Elysia().get('/health', () => 'OK');
export default app;
