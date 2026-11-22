import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// SITE e BASE vêm do ambiente (ex.: deploy em https://usuario.github.io/portfolio/).
export default defineConfig({
  site: process.env.SITE ?? 'https://oluanunes.github.io',
  base: process.env.BASE ?? '/',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
