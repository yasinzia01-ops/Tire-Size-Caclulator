// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://tiresizecalculator.pro',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap()],
});
