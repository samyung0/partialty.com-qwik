/*
 * WHAT IS THIS FILE?
 *
 * It's the entry point for the Fastify server when building for production.
 *
 * Learn more about Node.js server integrations here:
 * - https://qwik.builder.io/docs/deployments/node/
 *
 */
import { type PlatformNode } from '@builder.io/qwik-city/middleware/node';
import Fastify from 'fastify';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import FastifyQwik from './plugins/fastify-qwik';

import Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

declare global {
  interface QwikCityPlatform extends PlatformNode {}
}

// Directories where the static assets are located
const distDir = join(fileURLToPath(import.meta.url), '..', '..', 'dist');
const buildDir = join(distDir, 'build');

// Allow for dynamic port and host
const PORT = parseInt(process.env.PORT ?? '3000');
const HOST = process.env.HOST ?? '0.0.0.0';

const start = async () => {
  // Create the fastify server
  // https://fastify.dev/docs/latest/Guides/Getting-Started/
  const fastify = Fastify({
    logger: true,
  });

  // Enable compression
  // https://github.com/fastify/fastify-compress
  // IMPORTANT NOTE: THIS MUST BE REGISTERED BEFORE THE fastify-qwik PLUGIN
  // await fastify.register(import('@fastify/compress'))

  // Handle Qwik City using a plugin
  // await fastify.register(FastifyQwik, { distDir, buildDir });

  // Sentry.init({
  //   dsn: 'https://1d99971a337e113ddfdc6007a8f60428@o4507112021688320.ingest.us.sentry.io/4507112102756352',
  //   integrations: [nodeProfilingIntegration()],
  //   // Performance Monitoring
  //   tracesSampleRate: 1.0, //  Capture 100% of the transactions
  //   // Set sampling rate for profiling - this is relative to tracesSampleRate
  //   profilesSampleRate: 1.0,
  // });

  // Start the fastify server
  await fastify.listen({ port: PORT, host: HOST });
};

start();
