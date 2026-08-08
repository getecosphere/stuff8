import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

const isDev = process.env.ECO_DEPLOY_MODE !== 'prod' && !process.env.CF_PAGES;

export default defineConfig({
  integrations: [tailwind()],
  trailingSlash: 'always',
  output: isDev ? 'static' : 'hybrid',
  adapter: isDev ? undefined : cloudflare(),
  redirects: {
    '/signin': '/auth/signin/'
  },
  server: {
    port: Number(process.env.PORT) || 3000,
    host: true
  },
  devToolbar: {
    enabled: false
  }
});
