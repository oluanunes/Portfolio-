# Site de portfólio de fotografia — documento de design

Data: 2026-11-22
Status: aguardando aprovação do Luan

## 1. Intenção e porquê

Um site de portfólio cujo objetivo principal é **gerar pedidos de orçamento**.
O visitante deve ver fotos fortes, entender rapidamente qual trabalho se aplica a ele e chegar a um pedido de orçamento sem esforço.
O estilo vem de phsofia.com e remyshoots.co.za (ar de fotografia, escuro, foto em primeiro plano), porém **mais simples**.
Também vem de três maquetes de referência (GreaterPhoto, The Great Outdoors, Visit Tokyo): fundo escuro, hero em tela cheia, cartões verticais e texto sobre a foto.

## 2. Metas, não-metas e anti-metas

**Metas**
- Três áreas de trabalho bem separadas: Paisagem e Viagem; Retrato, Casal e Família; Comercial e Audiovisual (carros, sets de filmagem e projetos sob encomenda).
- Site em francês (CH), inglês e português (BR).
- Modo escuro e claro, com troca manual.
- Texto e painéis com transparência sobre a foto de fundo (degradê suave), legíveis nos dois modos.
- Rápido no celular.
- Custo zero de ferramentas e hospedagem.

**Não-metas (versão 1)**
- Loja, venda de prints ou cursos, pagamentos.
- Blog.
- CMS (painel de edição).
- Vídeo no hero (o espaço fica reservado para o futuro).

**Anti-metas** (falha mesmo que "funcione")
- Tela de carregamento, som ou animação pesada.
- Galeria única misturando as três áreas, que parece indecisa e converte pouco.
- Texto ilegível sobre foto, principalmente no modo claro.
- Qualquer custo recorrente obrigatório.

## 3. Restrições

- Custo zero. Qualquer serviço que exija plano pago será avisado antes.
- Fotos pesadas: precisam de otimização automática (formatos modernos, tamanhos responsivos, carregamento sob demanda).
- Três idiomas desde o início.
- Construído e mantido pelo Claude, com o Luan editando só conteúdo (textos e fotos).

## 4. Abordagens consideradas

- **A. HTML/CSS/JS puros.** Simples e leve, mas com 3 idiomas × 3 categorias vira muita página duplicada, e cada ajuste precisa ser repetido.
- **B. Astro (gerador de sites estáticos).** Rotas de idioma nativas, otimização de imagens e componentes reaproveitados. Exige Node no computador do Luan.
- **C. Construtor (Webflow ou similar).** Descartada: plano pago para publicar, e vai contra o objetivo de custo zero.

**Escolhida pelo Luan: B (Astro)**, porque três idiomas e fotos pesadas favorecem componentes e otimização automática.

## 5. Decisões

**Decidido pelo Luan**
- Áreas: paisagem e viagem; retrato, casal e família; carros e set de filmagem.
- Objetivo: pedido de orçamento ou contratação.
- Idiomas: francês (CH), inglês, português (BR).
- Modo escuro e claro.
- Transparência do conteúdo sobre o fundo.
- Ar de phsofia e remyshoots, porém mais simples.

**Minhas decisões (proposta, o Luan pode mudar)**
1. **Páginas por idioma** (`/fr`, `/en`, `/pt`): Home; uma página por área (Paisagem e Viagem, Retrato e Família, Comercial e Audiovisual); Sobre; Orçamento.
2. **Home:** hero em tela cheia com foto, nome e uma frase; três "portas" (cartões verticais, um por área); grade das melhores séries; Sobre curto; chamada para orçamento.
3. **Cada área tem sua própria chamada para orçamento**, com texto específico daquele tipo de cliente.
4. **Tema:** variáveis de CSS, respeita a preferência do sistema, botão de troca manual e escolha guardada. Textos sobre foto ficam sobre um degradê (scrim) nos dois modos, em vez de vidro transparente puro.
5. **Efeito visual leve:** transições suaves ao rolar, sem som e sem tela de carregamento. Respeita a preferência de "reduzir movimento" do sistema.
6. **Formulário de orçamento:** serviço gratuito de envio por e-mail (Web3Forms; alternativa Formspree). Confirmar o limite do plano grátis antes de publicar.
7. **Hospedagem:** GitHub Pages (conta GitHub já conectada), com Cloudflare Pages como alternativa. Domínio próprio é opcional e pago (~10–15 CHF/ano); sem ele o endereço é um `.github.io` gratuito.
8. **Imagens:** otimização automática do Astro; carregamento sob demanda; texto alternativo em todas as fotos.
9. **Básico de SEO e acessibilidade:** títulos por idioma, `hreflang`, contraste mínimo, navegação por teclado.

## 6. Deixado para o construtor

Tipografia exata, paleta de cores e cor de destaque, microinterações, estrutura de pastas, componentes.

## 7. Pendências do Luan (preciso destas para construir o conteúdo real)

1. **Nome ou marca** a usar no site (o nome próprio basta).
2. **Fotos:** 8 a 12 por área, em boa resolução. Enquanto não chegarem, uso imagens de substituição.
3. **E-mail** que vai receber os pedidos de orçamento.
4. **Textos "Sobre"** e das áreas: posso rascunhar em três idiomas para o Luan revisar.
5. **Domínio próprio:** quer ou prefere começar no endereço gratuito?
6. **Pasta no computador** onde o projeto será criado (preciso pedir acesso na hora de construir).
