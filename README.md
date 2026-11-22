# Site de portfólio

Site estático trilíngue (PT, FR, EN) de portfólio de fotografia, feito com Astro e TypeScript.

- `npm install` instala as dependências.
- `npm run dev` abre o servidor de desenvolvimento.
- `npm run build` gera o site estático em `dist/`.
- `npm test` roda os testes (Vitest); `npm run check` valida o build (script criado mais adiante).

## Formulário de orçamento

- Copie `.env.example` para `.env` (não vai para o Git) e preencha antes do build.
- `PUBLIC_WEB3FORMS_KEY`: chave gratuita criada em web3forms.com com o e-mail que recebe os pedidos. É pública por desenho. Sem ela, o formulário não envia nada pelo site e só oferece o link `mailto:` de reserva.
- `PUBLIC_CONTACT_EMAIL`: e-mail do link `mailto:` de reserva (usado quando o envio falha ou a chave falta). Sem ele, o link não aparece e só a mensagem é mostrada.
- Defina pelo menos uma das duas para que os visitantes consigam falar com você; o ideal é definir as duas. Com as duas vazias, o build avisa e o formulário não entrega nada.
- As variáveis entram no build: depois de mudá-las, rode `npm run build` de novo.
