import { cors } from '@elysiajs/cors';
import { cron } from '@elysiajs/cron';
import { Elysia } from 'elysia';
import { compression } from 'elysia-compression';
import { helmet } from 'elysia-helmet';
// import { ip } from "elysia-ip";
import { rateLimit } from 'elysia-rate-limit';
import AuthRoute from './auth/route';
import MuxRoute from './contentEditor/route';
import EmailRoute from './email/route';
import endpoints from './endpoints';
import HealthRoute from './health/route';
import StripeRoute from './stripe/route';

const port = process.env.PORT || 8080;
const allowedDomains = [/^https:\/\/(.*\.)?partialty\.com$/, /http:\/\/localhost:.*/];

const app = new Elysia()
  // .use(ip())
  .use(
    cors({
      origin: (request) => {
        const origin = request.headers.get('origin');
        if (!origin) return false;
        for (const domain of allowedDomains) if (domain.test(origin)) return true;
        return false;
      },
    })
  )
  .use(
    rateLimit({
      max: 20,
    })
  )
  .use(
    cron({
      name: 'heartbeat',
      pattern: '* */14 * * * *', // render apps sleep every 15 minutes
      run() {
        try {
          fetch('https://api.partialty.com');
        } catch (e) {}
      },
    })
  )
  .use(
    cron({
      name: 'heartbeat2',
      pattern: '* * */4 * * *', // avoid cold start in vercel for root
      run() {
        try {
          // put the major sites here
          endpoints.forEach((endpoint) => {
            fetch(endpoint);
          });
        } catch (e) {}
      },
    })
  )
  .use(compression())
  .use(helmet())
  .use(HealthRoute)
  .use(AuthRoute)
  .use(EmailRoute)
  .use(MuxRoute)
  .use(StripeRoute)
  .get('/endpoints', () => endpoints)
  .listen(port)
  .onError(({ code, error }) => {
    return new Response(error.toString());
  });

console.log('Server started at port: ' + port);
export type App = typeof app;
