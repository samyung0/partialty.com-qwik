import Elysia, { t } from 'elysia';
import _stripe from 'stripe';
import { turso } from '../turso';

if (!Bun.env.STRIPE_SECRET || !Bun.env.STRIPE_WEBHOOK_SECRET) throw new Error('Unable to start Stripe!');
const stripe = new _stripe(Bun.env.STRIPE_SECRET);

export const HOBBYIST_PLAN_APIID = 'price_1OiomQLx4lTJdkPOXZOpKy20';
export const HOBBYIST_PLAN_APIID_DEV = 'price_1Oja9ILx4lTJdkPOymsMltaQ';

const app = new Elysia().group('/stripe', (app) => {
  return app
    .get('/customer/:customerId', async ({ params: { customerId } }) => {
      return await stripe.customers.retrieve(customerId, { expand: ['subscriptions'] });
    })
    .post(
      '/customer',
      async ({ body }) => {
        const { name, userId, email } = body;
        const customer = await stripe.customers.create({
          name,
          email,
        });
        await turso.execute(`UPDATE profiles SET stripe_id = '${customer.id}' WHERE id = '${userId}';`);
        return customer.id;
      },
      {
        body: t.Object({
          userId: t.String(),
          name: t.String(),
          email: t.String(),
        }),
      }
    )
    .get('/subscription/:subscriptionId', async ({ params: { subscriptionId } }) => {
      return await stripe.subscriptions.retrieve(subscriptionId);
    })
    .post(
      '/cancel-subscription',
      async ({ body }) => {
        const { subscriptionId } = body;
        return await stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: true,
        });
      },
      {
        body: t.Object({
          subscriptionId: t.String(),
        }),
      }
    )
    .post(
      '/create-session',
      async ({ body }) => {
        const session = await stripe.checkout.sessions.create({
          line_items: [
            {
              price: body.dev ? HOBBYIST_PLAN_APIID_DEV : HOBBYIST_PLAN_APIID,
              quantity: 1,
            },
          ],
          mode: 'subscription',
          success_url: body.dev
            ? `http://localhost:5173/purchase?success=1`
            : `https://www.partialty.com/purchase?success=1`,
          cancel_url: body.dev
            ? `http://localhost:5173/purchase?success=0`
            : `https://www.partialty.com/purchase?success=0`,
          billing_address_collection: 'auto',
          customer: body.customerId,
        });
        return {
          url: session.url,
          id: session.id,
        };
      },
      {
        body: t.Object({
          customerId: t.String(),
          dev: t.Boolean(),
        }),
      }
    )
    .post(
      '/webhook',
      async ({ body, headers }) => {
        let event: any = body;
        const signature = headers['stripe-signature'];
        if (!signature) return;
        try {
          event = await stripe.webhooks.constructEventAsync(body as string, signature, Bun.env.STRIPE_WEBHOOK_SECRET!);
        } catch (err: any) {
          console.log(`⚠️  Webhook signature verification failed.`, err.message);
          throw Error(err);
        }
        switch (event.type) {
          case 'customer.subscription.deleted': {
            try {
              const customer = event.object.customer;
              if (!customer) throw new Error('Cannot retreive customer ID!');
              turso.execute(
                `UPDATE profiles SET role = 'free' WHERE stripe_id = '${customer}' AND role = 'paid' RETURNING *;`
              );
            } catch (e) {
              console.error(e);
            }
            return;
          }
          case 'checkout.session.completed': {
            try {
              const invoice = await stripe.invoices.retrieve(event.data.object.invoice);
              const chargeId = invoice.charge;

              const subscription = await stripe.subscriptions.retrieve(event.data.object.subscription);
              if (!subscription) throw new Error('Unable to retrieve subscription! Refunding');
              if (subscription.items.data.length > 1) throw new Error('More than one item in subscription! Refunding');
              const item = subscription.items.data[0].id;
              if (!item || (item !== HOBBYIST_PLAN_APIID && item !== HOBBYIST_PLAN_APIID_DEV))
                throw new Error('Item is not hobbyist plan! Refunding');

              const tx = await turso.transaction('write');
              try {
                const user = await tx.execute(
                  `SELECT role FROM profiles WHERE stripe_id = '${event.data.object.customer}';`
                );
                if (user.rows[0].role !== 'free') throw new Error('Customer is not of role free!  Refunding...');
                await tx.execute(
                  `UPDATE profiles SET role = 'paid' WHERE stripe_id = '${event.data.object.customer}' AND role = 'free' RETURNING *;`
                );
                await tx.commit();
              } catch (e) {
                console.error(e);
                tx.rollback();

                if (!chargeId || typeof chargeId !== 'string') {
                  return console.error('Refund failed! Customer ID: ', event.data.object.customer);
                }
                const refund = await stripe.refunds.create({
                  charge: chargeId,
                });
              }
            } catch (e) {
              console.error(e);
            }
            return;
          }
        }
      },
      {
        async parse(ctx) {
          return await ctx.request.text();
        },
        body: t.Not(t.Undefined()),
      }
    );
});
export default app;
