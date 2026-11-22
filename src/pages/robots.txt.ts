import type { APIRoute } from 'astro';
import { href } from '../lib/url';

// Gerado no build para que a linha Sitemap use o `site` e a `base` configurados.
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL(href('/sitemap-index.xml'), site).href;
  const body = ['User-agent: *', 'Allow: /', '', `Sitemap: ${sitemap}`, ''].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
