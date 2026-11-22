// Verifica a saída do build (`dist/`). Uso: node scripts/check-build.mjs [distDir]
// Só usa módulos nativos do Node. Sai com código 1 se alguma regra falhar.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(process.argv[2] ?? join(root, 'dist'));

const LANGS = ['pt', 'fr', 'en'];
const AREAS = ['landscape', 'portrait', 'commercial'];
const HTML_LANG = { pt: 'pt-BR', fr: 'fr-CH', en: 'en' };
const OG_LOCALE = { pt: 'pt_BR', fr: 'fr_CH', en: 'en_US' };
const MAX_DESCRIPTION = 160;
const MAX_PHOTO_BYTES = 8 * 1024 * 1024;

/** Páginas esperadas: rota (com barras) -> arquivo e idioma (null na raiz). */
const pages = [{ route: '/', file: 'index.html', lang: null }];
for (const lang of LANGS) {
  pages.push({ route: `/${lang}/`, file: `${lang}/index.html`, lang });
  for (const area of AREAS) {
    pages.push({ route: `/${lang}/${area}/`, file: `${lang}/${area}/index.html`, lang });
  }
}

const failures = [];
const warnings = [];
const fail = (page, rule, detail = '') => failures.push(`FAIL ${page} :: ${rule}${detail ? ` (${detail})` : ''}`);
const warn = (page, rule, detail = '') => warnings.push(`WARN ${page} :: ${rule}${detail ? ` (${detail})` : ''}`);

// ---------- leitura simples do HTML (a saída estática do Astro é regular) ----------

const decode = (s) =>
  s.replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

function attrsOf(tag) {
  const attrs = {};
  for (const m of tag.matchAll(/([^\s"'<>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g)) {
    attrs[m[1].toLowerCase()] ??= decode(m[2] ?? m[3] ?? m[4] ?? '');
  }
  return attrs;
}

const tagsOf = (html, name) =>
  [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map((m) => attrsOf(m[0].slice(name.length + 1)));

const metaContent = (html, key, value) =>
  tagsOf(html, 'meta')
    .filter((a) => a[key] === value)
    .map((a) => a.content ?? '');

function readPage(page) {
  const path = join(dist, page.file);
  if (!existsSync(path)) {
    fail(page.route, 'página não existe', page.file);
    return null;
  }
  return readFileSync(path, 'utf8');
}

function walk(dir, visit) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, visit);
    else visit(full);
  }
}

// ---------- regras ----------

if (!existsSync(dist)) {
  console.error(`FAIL ${dist} :: pasta de build não existe (rode npm run build)`);
  process.exit(1);
}

const html = new Map();
for (const page of pages) {
  const content = readPage(page);
  if (content !== null) html.set(page.route, content);
}

// Base do site derivada da raiz: "https://host/" ou "https://host/portfolio/".
const rootCanonical = html.has('/') ? (tagsOf(html.get('/'), 'link').find((a) => a.rel === 'canonical')?.href ?? '') : '';
const isAbsolute = (url) => /^https?:\/\/[^/\s]+/i.test(url);
const siteRoot = isAbsolute(rootCanonical) && rootCanonical.endsWith('/') ? rootCanonical : null;
const urlFor = (route) => (siteRoot ? siteRoot + route.slice(1) : null);

const titles = new Map();
for (const page of pages) {
  const doc = html.get(page.route);
  if (doc === undefined) continue;
  const where = page.route;

  // <html lang>
  const htmlTag = doc.match(/<html\b[^>]*>/i);
  const htmlLang = htmlTag ? (attrsOf(htmlTag[0].slice(5)).lang ?? '') : '';
  if (!htmlLang.trim()) fail(where, '<html lang> ausente ou vazio');
  else if (page.lang && htmlLang !== HTML_LANG[page.lang]) {
    fail(where, '<html lang> não corresponde ao idioma da página', `${htmlLang} != ${HTML_LANG[page.lang]}`);
  }

  // <title> e meta description
  const title = decode((doc.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '').trim());
  if (!title) fail(where, '<title> ausente ou vazio');
  else titles.set(where, title);

  const description = (metaContent(doc, 'name', 'description')[0] ?? '').trim();
  if (!description) fail(where, 'meta description ausente ou vazia');
  else if (description.length > MAX_DESCRIPTION) {
    warn(where, `meta description com mais de ${MAX_DESCRIPTION} caracteres`, `${description.length}`);
  }

  // canonical absoluto e coerente com a rota
  const links = tagsOf(doc, 'link');
  const canonicals = links.filter((a) => a.rel === 'canonical');
  const canonical = canonicals[0]?.href ?? '';
  if (canonicals.length !== 1 || !canonical) fail(where, 'deve haver exatamente um <link rel="canonical"> com href');
  else if (!isAbsolute(canonical)) fail(where, 'canonical não é URL absoluta', canonical);
  else if (urlFor(page.route) && canonical !== urlFor(page.route)) {
    fail(where, 'canonical diferente do esperado', `${canonical} != ${urlFor(page.route)}`);
  }

  // Open Graph
  const og = (name) => (metaContent(doc, 'property', name)[0] ?? '').trim();
  for (const name of ['og:title', 'og:description', 'og:type', 'og:url', 'og:locale']) {
    if (!og(name)) fail(where, `meta ${name} ausente ou vazia`);
  }
  if (og('og:url') && canonical && og('og:url') !== canonical) fail(where, 'og:url diferente do canonical');
  if (page.lang && og('og:locale') && og('og:locale') !== OG_LOCALE[page.lang]) {
    fail(where, 'og:locale não corresponde ao idioma', `${og('og:locale')} != ${OG_LOCALE[page.lang]}`);
  }

  // favicon declarado e presente no build
  const icon = links.find((a) => (a.rel ?? '').split(/\s+/).includes('icon'));
  if (!icon?.href) fail(where, '<link rel="icon"> ausente');
  else if (!/\/favicon\.svg$/.test(icon.href) || !existsSync(join(dist, 'favicon.svg'))) {
    fail(where, 'favicon não aponta para um favicon.svg existente', icon.href);
  }

  // hreflang: só nas páginas de idioma (Home e áreas); a raiz fica de fora
  if (page.lang) {
    const alts = links.filter((a) => a.rel === 'alternate' && a.hreflang);
    const suffix = page.route.slice(`/${page.lang}/`.length);
    for (const code of LANGS) {
      const found = alts.filter((a) => a.hreflang === HTML_LANG[code]);
      const want = urlFor(`/${code}/${suffix}`);
      if (found.length !== 1) fail(where, `hreflang ${HTML_LANG[code]} deve aparecer uma vez`, `${found.length}`);
      else if (!isAbsolute(found[0].href)) fail(where, `hreflang ${HTML_LANG[code]} não é URL absoluta`, found[0].href);
      else if (want && found[0].href !== want) fail(where, `hreflang ${HTML_LANG[code]} diferente do esperado`, `${found[0].href} != ${want}`);
    }
    const xDefault = alts.filter((a) => a.hreflang === 'x-default');
    if (xDefault.length !== 1) fail(where, 'hreflang x-default deve aparecer uma vez', `${xDefault.length}`);
    else if (!isAbsolute(xDefault[0].href)) fail(where, 'hreflang x-default não é URL absoluta', xDefault[0].href);
    else if (siteRoot && xDefault[0].href !== siteRoot) fail(where, 'hreflang x-default deve apontar para a raiz', xDefault[0].href);
  }
}

// títulos únicos entre as páginas
const byTitle = new Map();
for (const [route, title] of titles) byTitle.set(title, [...(byTitle.get(title) ?? []), route]);
for (const [title, routes] of byTitle) {
  if (routes.length > 1) fail(routes.join(' e '), 'título duplicado', title);
}

// <img> com alt não vazio, em TODAS as páginas HTML do build
walk(dist, (file) => {
  if (!file.endsWith('.html')) return;
  const rel = file.slice(dist.length).replaceAll('\\', '/');
  for (const img of tagsOf(readFileSync(file, 'utf8'), 'img')) {
    if (!(img.alt ?? '').trim()) fail(rel, '<img> sem alt ou com alt vazio', img.src ?? '(sem src)');
  }
});

// CSS final com prefers-reduced-motion
const astroDir = join(dist, '_astro');
const css = existsSync(astroDir)
  ? readdirSync(astroDir)
      .filter((f) => f.endsWith('.css'))
      .map((f) => readFileSync(join(astroDir, f), 'utf8'))
      .join('\n')
  : '';
if (!css) fail('_astro/*.css', 'nenhum CSS encontrado no build');
else if (!css.includes('prefers-reduced-motion')) fail('_astro/*.css', 'CSS final sem prefers-reduced-motion');

// robots.txt
const robotsPath = join(dist, 'robots.txt');
if (!existsSync(robotsPath)) fail('/robots.txt', 'arquivo não existe');
else {
  const sitemapLine = readFileSync(robotsPath, 'utf8').match(/^Sitemap:\s*(\S+)\s*$/im)?.[1];
  if (!sitemapLine) fail('/robots.txt', 'linha Sitemap ausente');
  else if (!isAbsolute(sitemapLine)) fail('/robots.txt', 'linha Sitemap não é URL absoluta', sitemapLine);
  else if (siteRoot && sitemapLine !== `${siteRoot}sitemap-index.xml`) {
    fail('/robots.txt', 'linha Sitemap diferente de <site+base>sitemap-index.xml', sitemapLine);
  }
}

// sitemap: índice -> sitemap filho -> as 12 páginas de idioma
const indexPath = join(dist, 'sitemap-index.xml');
if (!existsSync(indexPath)) fail('/sitemap-index.xml', 'arquivo não existe');
else {
  const children = [...readFileSync(indexPath, 'utf8').matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
  if (children.length === 0) fail('/sitemap-index.xml', 'índice não referencia nenhum sitemap filho');
  const locs = [];
  for (const child of children) {
    const name = child.split('/').pop();
    const childPath = join(dist, name);
    if (!existsSync(childPath)) fail('/sitemap-index.xml', 'sitemap filho referenciado não existe', name);
    else locs.push(...[...readFileSync(childPath, 'utf8').matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]));
  }
  const langPages = pages.filter((p) => p.lang);
  if (children.length > 0 && locs.length < langPages.length) {
    fail('/sitemap-index.xml', `sitemap filho com menos de ${langPages.length} <loc>`, `${locs.length}`);
  }
  // Se nenhum <loc> foi lido, a falha acima já explica; não repete uma linha por página.
  for (const p of langPages.filter(() => locs.length > 0)) {
    const want = urlFor(p.route);
    if (want && !locs.includes(want)) fail(p.route, 'ausente do sitemap', want);
  }
  if (siteRoot) {
    for (const loc of locs) if (!loc.startsWith(siteRoot)) fail('/sitemap', '<loc> fora de site+base', loc);
    for (const child of children) if (!child.startsWith(siteRoot)) fail('/sitemap-index.xml', 'filho fora de site+base', child);
  }
}

// fotos acima de 8 MB: só avisa
const photosDir = join(root, 'src', 'assets', 'photos');
if (existsSync(photosDir)) {
  walk(photosDir, (file) => {
    const size = statSync(file).size;
    if (size > MAX_PHOTO_BYTES) {
      warn(file.slice(root.length + 1), 'foto acima de 8 MB', `${(size / 1024 / 1024).toFixed(1)} MB`);
    }
  });
}

// ---------- resultado ----------

for (const line of [...failures, ...warnings]) console.log(line);
if (failures.length > 0) {
  console.log(`FAIL: ${failures.length} regra(s) falharam, ${warnings.length} aviso(s) em ${dist}`);
  process.exit(1);
}
console.log(`OK: ${pages.length} páginas verificadas, ${warnings.length} aviso(s) em ${dist}`);
