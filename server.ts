import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  server.get('/runtime-config.js', (_req, res) => {
    const runtimeConfig = compact({
      apiUrl: process.env['FOODBOT_API_URL'] || process.env['API_URL'],
      supabaseUrl: process.env['FOODBOT_SUPABASE_URL'],
      supabaseKey: process.env['FOODBOT_SUPABASE_KEY'],
      aiCoach: compact({
        enabled: parseBoolean(process.env['FOODBOT_AI_COACH_ENABLED']),
        whatsappUrl: process.env['FOODBOT_AI_COACH_WHATSAPP_URL'],
      }),
    });

    res
      .type('application/javascript')
      .set('Cache-Control', 'no-store')
      .send(`globalThis.__FOODBOT_CONFIG__ = ${JSON.stringify(runtimeConfig)};`);
  });

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on port ${port}`);
  });
}

run();

function compact<T extends Record<string, unknown>>(value: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => {
      if (entry == null || entry === '') {
        return false;
      }

      if (typeof entry === 'object' && !Array.isArray(entry)) {
        return Object.keys(entry).length > 0;
      }

      return true;
    })
  ) as Partial<T>;
}

function parseBoolean(value: string | undefined): boolean | undefined {
  if (value == null || value === '') {
    return undefined;
  }

  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}
