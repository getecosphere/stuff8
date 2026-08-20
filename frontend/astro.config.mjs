import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

const port = parseInt(process.env.PORT, 10) || 3000;

export default defineConfig({
  integrations: [
    tailwind(),
  ],
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  server: { port, host: true },
  // The estate gateway LXS normalizes trailing slashes on forward (strips the
  // slash), so Astro must not re-add them with a 301 — 'always' + the gateway's
  // normalization produced a redirect loop on /inventory/. 'ignore' serves
  // both forms without redirecting.
  trailingSlash: 'ignore',
  redirects: {
    '/signin': '/auth/signin/'
  },
  devToolbar: { enabled: false },
});
