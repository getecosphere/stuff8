import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  trailingSlash: 'always',
  output: 'hybrid',
  adapter: cloudflare(),
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
