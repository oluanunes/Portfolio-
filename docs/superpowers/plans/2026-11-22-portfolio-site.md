# Site de portfólio — plano de implementação

> **Para quem executa:** USAR superpowers:executing-plans (modo nativo) ou superpowers:subagent-driven-development. Os passos usam caixas `- [ ]`.

**Objetivo:** construir o site de portfólio trilíngue (FR-CH, EN, PT-BR), com modo escuro e claro, focado em pedidos de orçamento, hospedado de graça.

**Arquitetura:** site estático em Astro. Rotas `/{lang}/` e `/{lang}/{area}/`, textos em dicionários por idioma, tema por variáveis CSS, imagens otimizadas pelo Astro. Só a lógica pura (idioma, tema, contraste, formulário, filtro) tem testes unitários. O resto é verificado por um script que inspeciona o HTML gerado.

**Stack:** Astro, TypeScript, Vitest, sharp (já vem com o Astro), `@astrojs/sitemap`, Web3Forms (envio do formulário), GitHub Pages + GitHub Actions.

**Spec:** `design-site-portfolio.md` (vai para `docs/superpowers/specs/2026-11-22-site-portfolio-design.md` no projeto). Prévia visual: artefato "Prévia do site de portfólio" (Home, Retrato, Mobile).

## Restrições globais

- Custo zero. Qualquer serviço com plano pago deve ser avisado antes de usar.
- Idiomas: francês (CH), inglês e português (BR). Nome provisório `[SEU NOME]`.
- Três áreas, slugs iguais nos três idiomas: `landscape` (Paisagem e Viagem), `portrait` (Retrato, Casal e Família), `commercial` (Comercial e Audiovisual: carros, sets de filmagem e projetos sob encomenda).
- Anti-metas: sem tela de carregamento, sem som, sem animação pesada, sem galeria única misturando as áreas.
- Respeitar `prefers-reduced-motion`. Contraste mínimo 4,5:1 para texto. Alvos de toque de pelo menos 44 px.
- Cores (valores exatos da prévia):
  - Escuro: fundo `#0E1012`, superfície `#171A1D`, texto `#EDE9E2`, texto secundário `#A9A399`, destaque `#D9A25B`, texto sobre destaque `#14110C`.
  - Claro: fundo `#F5F2ED`, superfície `#EAE5DC`, texto `#17191B`, texto secundário `#59544B`, destaque `#9A5B12`, texto sobre destaque `#FFFFFF`.
- Tipografia: Cormorant Garamond (títulos), Inter (corpo).
- Textos sobre foto ficam sobre degradê escuro `rgba(0,0,0,0.78)` embaixo, nos dois temas.
- Minhas decisões, ajustáveis: idioma padrão `fr`; formulário via Web3Forms; hospedagem GitHub Pages.

## Foco da revisão (entradas que o spec não menciona)

1. Idioma do navegador fora de pt/fr/en, ou lista vazia: cai em `fr` (Task 2).
2. JavaScript desligado: a raiz mostra links para os três idiomas e o tema padrão é escuro, sem "piscada" (Task 4).
3. Texto branco sobre foto muito clara continua legível no tema claro (Task 3).
4. Envio do formulário falha ou está offline: mensagem visível com alternativa por e-mail, sem perder o texto digitado. `?tipo=` inválido é ignorado (Task 8).
5. Foto sem texto alternativo, ou original gigante no repositório: a verificação do build falha ou avisa (Task 9).

---

### Task 1: Projeto e repositório

**Arquivos:** criar `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `.gitignore`, `README.md`, `docs/superpowers/{specs,plans}/` (copiar spec e este plano).

**Interfaces:** produz os scripts `npm run dev`, `npm run build`, `npm test` (`vitest run`) e `npm run check` (`node scripts/check-build.mjs`).

- [ ] **Passo 1:** pedir acesso a uma pasta do computador (`device_request_folder_access`) e confirmar que Node 20 ou superior está instalado (`node -v`). Se não estiver, parar e avisar o Luan.
- [ ] **Passo 2:** criar o projeto Astro vazio (TypeScript estrito) na pasta e adicionar Vitest e `@astrojs/sitemap`.
- [ ] **Passo 3:** rodar `npm run build`. Esperado: build vazio conclui sem erro.
- [ ] **Passo 4:** `git init` e commit `chore: projeto Astro inicial`.

### Task 2: Idiomas

**Arquivos:** criar `src/i18n/{pt,fr,en}.ts`, `src/i18n/index.ts`; teste `src/i18n/index.test.ts`.

**Interfaces:** produz `type Lang = 'pt'|'fr'|'en'`, `LANGS: Lang[]`, `DEFAULT_LANG: Lang` (`'fr'`), `t(lang: Lang, key: DictKey): string`, `pickLang(navigatorLangs: readonly string[]): Lang`. Os dicionários usam as chaves e os textos da prévia (Home, formulário, áreas).

- [ ] **Passo 1:** escrever os testes, que devem falhar:
  - `pickLang(['pt-BR'])` é `'pt'`; `pickLang(['en-US'])` é `'en'`; `pickLang(['de-CH','fr-CH'])` é `'fr'`.
  - `pickLang(['de'])` e `pickLang([])` são `'fr'`.
  - Os três dicionários têm exatamente as mesmas chaves e nenhum valor vazio.
- [ ] **Passo 2:** implementar. `pickLang` usa o prefixo de cada idioma da lista, na ordem, e devolve o primeiro suportado.
- [ ] **Passo 3:** `npm test`. Esperado: passa.
- [ ] **Passo 4:** commit `feat: dicionários e escolha de idioma`.

### Task 3: Tema e contraste

**Arquivos:** criar `src/styles/tokens.css`, `src/lib/theme.ts`, `src/lib/contrast.ts`; testes `src/lib/theme.test.ts`, `src/lib/contrast.test.ts`.

**Interfaces:** produz `type Theme = 'dark'|'light'`, `resolveTheme(stored: string | null, prefersLight: boolean): Theme`, `contrastRatio(fg: string, bg: string): number` (hex de 6 dígitos). `tokens.css` define as variáveis `--bg --surface --text --muted --line --accent --accent-text` em `:root` (escuro) e `[data-theme="light"]`.

- [ ] **Passo 1:** testes que devem falhar:
  - `resolveTheme('light', false)` é `'light'`; `resolveTheme('dark', true)` é `'dark'`.
  - `resolveTheme(null, true)` é `'light'`; `resolveTheme(null, false)` é `'dark'`; `resolveTheme('lixo', false)` é `'dark'`.
  - `contrastRatio('#000000','#ffffff')` é 21 (tolerância 0,01).
  - Em cada tema: texto/fundo, secundário/fundo, secundário/superfície e texto-sobre-destaque/destaque são ≥ 4,5.
  - Branco sobre `#383838` (pior caso: foto branca sob o degradê 0,78) é ≥ 4,5.
- [ ] **Passo 2:** implementar com os valores das restrições globais.
- [ ] **Passo 3:** `npm test`. Esperado: passa.
- [ ] **Passo 4:** commit `feat: tema, tokens e teste de contraste`.

### Task 4: Estrutura comum (layout)

**Arquivos:** criar `src/layouts/Base.astro`, `src/components/{Header,Footer,LangSwitch,ThemeToggle}.astro`, `src/pages/index.astro`, `public/theme-init.js`.

**Interfaces:** consome `LANGS`, `t`, `pickLang`, `resolveTheme`. Produz `Base.astro` com props `{ lang: Lang; title: string; description: string; path: string }`. Gera `<html lang>`, `<link rel="alternate" hreflang>` para os três idiomas e `x-default`, e carrega `theme-init.js` no `<head>` (aplica `data-theme` antes de pintar). `index.astro` é a raiz: redireciona por JavaScript com `pickLang(navigator.languages)` e traz `<noscript>` com links para `/fr/`, `/en/`, `/pt/`.

- [ ] **Passo 1:** implementar o layout e a raiz conforme a prévia (cabeçalho com menu, idiomas, botão de tema, botão "Orçamento"). Botões e links com pelo menos 44 px.
- [ ] **Passo 2:** rodar `npm run build` e conferir no HTML da raiz o `<noscript>` com os três links.
- [ ] **Passo 3:** commit `feat: layout, cabeçalho, idiomas e tema`.

### Task 5: Fotos e imagens de substituição

**Arquivos:** criar `scripts/make-placeholders.mjs`, `src/content/areas.ts`, `src/lib/photos.ts`; teste `src/lib/photos.test.ts`.

**Interfaces:** produz `type AreaSlug = 'landscape'|'portrait'|'commercial'`, `AREAS: AreaSlug[]`, `listPhotos(area: AreaSlug): ImageMetadata[]` (lê `src/assets/photos/<area>/*` com `import.meta.glob`, ordenado por nome), `altFor(lang: Lang, area: AreaSlug, index: number): string`.

- [ ] **Passo 1:** teste que deve falhar: `altFor` devolve texto não vazio para toda combinação de `LANGS × AREAS × índices 0–7`.
- [ ] **Passo 2:** implementar `altFor` a partir de chaves do dicionário. Escrever `make-placeholders.mjs` para gerar 8 JPGs em degradê por área (mesmos tons da prévia) em `src/assets/photos/`, com `sharp`.
- [ ] **Passo 3:** rodar o script e `npm test`. Esperado: passa, 24 imagens geradas.
- [ ] **Passo 4:** commit `feat: fotos de substituição e textos alternativos`.

### Task 6: Página inicial

**Arquivos:** criar `src/pages/[lang]/index.astro`, `src/components/{Hero,Doors,FeaturedSeries,About}.astro`, `src/lib/filter.ts`, `src/scripts/filter.ts`; teste `src/lib/filter.test.ts`.

**Interfaces:** consome `Base`, `t`, `listPhotos`, `altFor`. Produz `filterSeries<T extends { area: AreaSlug }>(items: T[], f: AreaSlug | 'all'): T[]`. `getStaticPaths` gera `fr`, `en`, `pt`.

- [ ] **Passo 1:** testes que devem falhar: `'all'` devolve todos; `'portrait'` devolve só os de retrato; lista vazia devolve vazia.
- [ ] **Passo 2:** implementar `filterSeries` e as seções da prévia (hero com degradê sob o texto, três portas, séries em destaque com filtro, Sobre). A foto do hero e dos cartões usa `<Image>` do Astro com `loading` preguiçoso, exceto a do hero.
- [ ] **Passo 3:** `npm test && npm run build`. Esperado: passa, três Homes geradas.
- [ ] **Passo 4:** commit `feat: página inicial trilíngue`.

### Task 7: Páginas de área

**Arquivos:** criar `src/pages/[lang]/[area].astro`, `src/components/{AreaHero,Gallery,Packages,AreaCta}.astro`.

**Interfaces:** consome `AREAS`, `listPhotos`, `altFor`, `t`. `getStaticPaths` gera 3 idiomas × 3 áreas. A chamada para orçamento de cada área aponta para `/{lang}/#orcamento?tipo={area}`.

- [ ] **Passo 1:** implementar conforme a prévia da página Retrato (capa, "Como é uma sessão", galeria, pacotes com texto provisório entre colchetes, chamada final própria da área).
- [ ] **Passo 2:** `npm run build`. Esperado: 9 páginas de área.
- [ ] **Passo 3:** commit `feat: páginas de área`.

### Task 8: Formulário de orçamento

**Arquivos:** criar `src/lib/quote.ts`, `src/components/QuoteForm.astro`, `src/scripts/quote-form.ts`, `.env.example`; teste `src/lib/quote.test.ts`.

**Interfaces:** produz `type QuoteInput = { name; email; type; date; message }` (todos `string`), `validateQuote(i: QuoteInput): { ok: true } | { ok: false; errors: Partial<Record<keyof QuoteInput, string>> }`, `submitQuote(i: QuoteInput, deps: { fetch: typeof fetch; accessKey?: string }): Promise<'sent'|'failed'|'unconfigured'>`, `parseTipo(search: string): AreaSlug | null`. A chave pública vem de `PUBLIC_WEB3FORMS_KEY`.

- [ ] **Passo 1:** testes que devem falhar:
  - e-mail sem `@` ou nome vazio dá erro na chave correspondente.
  - `submitQuote` sem `accessKey` devolve `'unconfigured'` e não chama `fetch`.
  - `fetch` que rejeita devolve `'failed'`; resposta `{ success: true }` devolve `'sent'`; resposta `{ success: false }` devolve `'failed'`.
  - `parseTipo('?tipo=portrait')` é `'portrait'`; `parseTipo('?tipo=xyz')` e `parseTipo('')` são `null`.
- [ ] **Passo 2:** implementar. O componente pré-seleciona o tipo via `parseTipo`. Em `'failed'` e `'unconfigured'`, mostra mensagem e um link `mailto:` com o texto já preenchido; o texto digitado nunca é apagado.
- [ ] **Passo 3:** `npm test`. Esperado: passa.
- [ ] **Passo 4:** o Luan cria a chave gratuita no Web3Forms com o e-mail que recebe os pedidos e a coloca em `.env`. Se ainda não tiver, o site publica no modo `'unconfigured'`.
- [ ] **Passo 5:** commit `feat: formulário de orçamento`.

### Task 9: SEO e verificação do build

**Arquivos:** criar `scripts/check-build.mjs`; modificar `astro.config.mjs` (sitemap), criar `public/robots.txt`.

**Interfaces:** `npm run check` lê `dist/` e termina com erro se alguma regra falhar.

- [ ] **Passo 1:** escrever `check-build.mjs` com as regras: existem a raiz, 3 Homes e 9 páginas de área; toda página tem `<html lang>`, `<title>` e `meta description` não vazios, e os 3 `hreflang` mais `x-default`; todo `<img>` tem `alt` não vazio; o CSS final contém `prefers-reduced-motion`; avisa (sem falhar) se algum arquivo em `src/assets/photos/` passar de 8 MB.
- [ ] **Passo 2:** `npm run build && npm run check`. Esperado: passa. Se falhar, corrigir a causa, não a regra.
- [ ] **Passo 3:** commit `feat: SEO e verificação do build`.

### Task 10: Publicação

**Arquivos:** criar `.github/workflows/deploy.yml`; modificar `astro.config.mjs` (`site`, `base`).

**Interfaces:** o workflow roda `npm ci`, `npm test`, `npm run build`, `npm run check` e publica `dist/` no GitHub Pages.

- [ ] **Passo 1:** pedir confirmação ao Luan antes de criar o repositório público `oluanunes/<nome>`. O GitHub Pages grátis exige repositório público, então o código do site ficará visível. Só então criar o repositório e fazer push.
- [ ] **Passo 2:** ativar Pages com fonte "GitHub Actions" e conferir o workflow verde.
- [ ] **Passo 3:** abrir o endereço `https://oluanunes.github.io/<nome>/` em modo escuro e claro, nos três idiomas, no computador e no celular. Registrar o que falhar e corrigir.
- [ ] **Passo 4:** domínio próprio fica para depois, se o Luan quiser (cerca de 10 a 15 CHF por ano).
