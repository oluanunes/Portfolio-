# Site de portfólio

Site estático trilíngue (PT, FR, EN) de portfólio de fotografia, feito com Astro e TypeScript.

- Requer Node 22.23.4 ou mais novo (o `.nvmrc` indica a série 22).
- `npm install` instala as dependências.
- `npm run dev` abre o servidor de desenvolvimento.
- `npm run build` gera o site estático em `dist/`.
- `npm test` roda os testes (Vitest); `npm run check` valida o build (rode depois de `npm run build`).

## Formulário de orçamento

- Copie `.env.example` para `.env` (não vai para o Git) e preencha antes do build.
- `PUBLIC_CONTACT_EMAIL`: e-mail de contato. Aparece no rodapé e no link `mailto:` do formulário (com o endereço também em texto, para copiar). Sem chave do Web3Forms, é por ele que o pedido sai: o formulário avisa que o envio será feito pelo app de e-mail da pessoa.
- `PUBLIC_WEB3FORMS_KEY`: chave gratuita criada em web3forms.com com o e-mail que recebe os pedidos. É pública por desenho. Com ela o pedido é enviado pelo site; o `mailto:` fica como reserva se o envio falhar.
- **Pelo menos uma das duas é obrigatória.** Com as duas vazias, `npm run check` falha (o formulário não entregaria nada). Para um build local de teste sem nenhuma, rode o check assim: `ALLOW_UNCONFIGURED=1 npm run check`. O workflow de publicação não usa esse atalho.
- As variáveis entram no build: depois de mudá-las, rode `npm run build` de novo.

## Publicação

O site é publicado no GitHub Pages por `.github/workflows/deploy.yml`: a cada push na branch `main` (ou ao rodar o workflow manualmente na aba Actions) ele roda `npm ci`, `npm test`, `npm run build`, `npm run check` e publica `dist/`.

1. O repositório precisa ser público: o GitHub Pages grátis não funciona com repositório privado, e o código do site ficará visível.
2. Em Settings → Pages, escolha Source: GitHub Actions.
3. Em Settings → Secrets and variables → Actions → aba Variables, crie `PUBLIC_WEB3FORMS_KEY` e `PUBLIC_CONTACT_EMAIL` (veja a seção do formulário acima). Pelo menos uma é obrigatória (sem nenhuma, o `npm run check` do workflow falha e nada é publicado); o ideal é definir as duas. Use Variables, não Secrets: os valores acabam no HTML do site de qualquer forma. Se mudar uma variável, rode o workflow de novo.
4. Endereço do site: `https://<usuario>.github.io/<nome-do-repositorio>/`. Se o repositório se chamar `<usuario>.github.io`, o site fica na raiz: `https://<usuario>.github.io/`. O workflow calcula `SITE` e `BASE` a partir do nome do repositório, então não há nada para editar no código.

Prévia local com o mesmo endereço do Pages (troque `meu-portfolio` pelo nome do repositório):

```sh
SITE=https://oluanunes.github.io BASE=/meu-portfolio/ npm run build
SITE=https://oluanunes.github.io BASE=/meu-portfolio/ npm run preview
```

Depois abra `http://localhost:4321/meu-portfolio/`. Sem `SITE` e `BASE`, o build usa a raiz (`/`).
