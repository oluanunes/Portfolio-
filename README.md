# Site de portfólio

Site estático trilíngue (PT, FR, EN) de portfólio de fotografia, feito com Astro e TypeScript.

- Requer Node 22.23.4 ou mais novo (o `.nvmrc` indica a série 22).
- `npm install` instala as dependências.
- `npm run dev` abre o servidor de desenvolvimento.
- `npm run build` gera o site estático em `dist/`.
- `npm test` roda os testes (Vitest); `npm run check` valida o build (rode depois de `npm run build`).

## Formulário de orçamento

- Copie `.env.example` para `.env` (não vai para o Git) e preencha antes do build.
- `PUBLIC_WEB3FORMS_KEY`: chave gratuita criada em web3forms.com com o e-mail que recebe os pedidos. É pública por desenho. Sem ela, o formulário não envia nada pelo site e só oferece o link `mailto:` de reserva.
- `PUBLIC_CONTACT_EMAIL`: e-mail do link `mailto:` de reserva (usado quando o envio falha ou a chave falta). Sem ele, o link não aparece e só a mensagem é mostrada.
- Defina pelo menos uma das duas para que os visitantes consigam falar com você; o ideal é definir as duas. Com as duas vazias, o build avisa e o formulário não entrega nada.
- As variáveis entram no build: depois de mudá-las, rode `npm run build` de novo.

## Publicação

O site é publicado no GitHub Pages por `.github/workflows/deploy.yml`: a cada push na branch `main` (ou ao rodar o workflow manualmente na aba Actions) ele roda `npm ci`, `npm test`, `npm run build`, `npm run check` e publica `dist/`.

1. O repositório precisa ser público: o GitHub Pages grátis não funciona com repositório privado, e o código do site ficará visível.
2. Em Settings → Pages, escolha Source: GitHub Actions.
3. Em Settings → Secrets and variables → Actions → aba Variables, crie `PUBLIC_WEB3FORMS_KEY` e `PUBLIC_CONTACT_EMAIL` (veja a seção do formulário acima). Pelo menos uma é obrigatória; o ideal é definir as duas. Use Variables, não Secrets: os valores acabam no HTML do site de qualquer forma. Se mudar uma variável, rode o workflow de novo.
4. Endereço do site: `https://<usuario>.github.io/<nome-do-repositorio>/`. Se o repositório se chamar `<usuario>.github.io`, o site fica na raiz: `https://<usuario>.github.io/`. O workflow calcula `SITE` e `BASE` a partir do nome do repositório, então não há nada para editar no código.

Prévia local com o mesmo endereço do Pages (troque `meu-portfolio` pelo nome do repositório):

```sh
SITE=https://oluanunes.github.io BASE=/meu-portfolio/ npm run build
SITE=https://oluanunes.github.io BASE=/meu-portfolio/ npm run preview
```

Depois abra `http://localhost:4321/meu-portfolio/`. Sem `SITE` e `BASE`, o build usa a raiz (`/`).
