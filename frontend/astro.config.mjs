import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  server: {
    port: Number(process.env.PORT) || 3000,
    host: true
  },
  devToolbar: {
    enabled: false
  }
});
