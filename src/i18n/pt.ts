import { BRAND } from '../content/site';

/**
 * Dicionário em português (pt-BR). É a fonte da lista de chaves: `DictKey`
 * (em index.ts) vem daqui, e fr.ts / en.ts precisam ter exatamente as mesmas.
 * Os textos entre colchetes de `area.*.package.*` são modelos para o conteúdo real;
 * a seção de pacotes fica desligada (`SHOW_PACKAGES` em src/content/site.ts) até existir texto de verdade.
 */
export const pt = {
  // Marca, menu e controles do cabeçalho
  'brand.logo': BRAND,
  'nav.menuLabel': 'Menu',
  'nav.skipToContent': 'Ir para o conteúdo',
  'nav.landscape': 'Paisagem',
  'nav.portrait': 'Retrato',
  'nav.commercial': 'Comercial',
  'nav.about': 'Sobre',
  'nav.cta': 'Orçamento',
  'lang.switchLabel': 'Idioma',
  'theme.toggleLabel': 'Alternar modo claro e escuro',

  // Rodapé
  'footer.copyright': `© ${BRAND}`,

  // Home
  'home.hero.title': 'Fotografia de paisagem, retrato e carros.',
  'home.hero.sub': 'Peça um orçamento para o seu projeto.',
  'home.hero.cta': 'Pedir orçamento',
  'home.hero.secondary': 'Ver trabalhos',
  'home.areas.label': 'Áreas',
  'home.areas.title': 'O que você precisa?',
  'home.areas.seeSeries': 'Ver série',
  'home.featured.title': 'Séries em destaque',
  'home.filter.all': 'Todas',
  'home.filter.landscape': 'Paisagem',
  'home.filter.portrait': 'Retrato',
  'home.filter.commercial': 'Comercial',
  'home.about.title': 'Sobre',
  'home.about.text': 'Sou fotógrafo brasileiro e vivo na Suíça romanda. Fotografo paisagens, pessoas e carros e gosto de entender bem o seu projeto antes de levantar a câmera. Escreva-me e eu respondo com uma proposta clara.',
  'home.about.cta': 'Falar comigo',

  // Formulário de orçamento
  'form.title': 'Peça um orçamento',
  'form.sub': 'Conte o que você precisa e para quando.',
  'form.name': 'Nome',
  'form.email': 'E-mail',
  'form.type': 'Tipo de trabalho',
  'form.date': 'Data prevista',
  'form.message': 'Mensagem',
  'form.send': 'Enviar pedido',
  'form.type.landscape': 'Paisagem e Viagem',
  'form.type.portrait': 'Retrato, Casal e Família',
  'form.type.commercial': 'Comercial e Audiovisual',
  'form.type.other': 'Outro',
  'form.sending': 'Enviando…',
  'form.sent': 'Pedido enviado. Respondo o mais breve possível.',
  'form.failed': 'Não foi possível enviar o pedido. Tente de novo em instantes.',
  'form.unconfigured': 'Para enviar o pedido, use o botão de e-mail abaixo.',
  'form.mailtoOnly': 'O pedido será enviado pelo seu aplicativo de e-mail.',
  'form.mailtoFallback': 'Enviar por e-mail',
  'form.mailtoSubject': 'Pedido de orçamento',
  'form.error.name': 'Informe seu nome.',
  'form.error.email': 'Informe um e-mail válido.',

  // Páginas de área: Paisagem e Viagem
  'area.landscape.title': 'Paisagem e Viagem',
  'area.landscape.tagline': 'Lugares, luz e horizontes.',
  'area.landscape.how.title': 'Como é um trabalho de paisagem',
  'area.landscape.how.text': 'Escolho os lugares junto com você, de acordo com a época do ano e com a luz que você procura. Cuido do planejamento e fotografo no ritmo de cada lugar. Depois seleciono e edito as melhores imagens para você.',
  'area.landscape.packages.title': 'Pacotes',
  'area.landscape.package.1': '[Pacote 1: duração, número de fotos e preço]',
  'area.landscape.package.2': '[Pacote 2: duração, número de fotos e preço]',
  'area.landscape.package.3': '[Pacote 3: duração, número de fotos e preço]',
  'area.landscape.cta.title': 'Vamos falar do seu projeto',
  'area.landscape.cta.text': 'O formulário abre já com Paisagem e Viagem selecionado.',
  'area.landscape.cta.button': 'Pedir orçamento de paisagem',

  // Páginas de área: Retrato, Casal e Família
  'area.portrait.title': 'Retrato, Casal e Família',
  'area.portrait.tagline': 'Pessoas como elas são.',
  'area.portrait.how.title': 'Como é uma sessão',
  'area.portrait.how.text': 'A sessão acontece onde você se sente à vontade: em casa, na rua ou na natureza. Eu conduzo com calma para que as fotos fiquem naturais. Depois escolho e edito as melhores imagens e envio a você.',
  'area.portrait.packages.title': 'Pacotes',
  'area.portrait.package.1': '[Retrato: duração, número de fotos e preço]',
  'area.portrait.package.2': '[Casal: duração, número de fotos e preço]',
  'area.portrait.package.3': '[Família: duração, número de fotos e preço]',
  'area.portrait.cta.title': 'Vamos marcar sua sessão',
  'area.portrait.cta.text': 'O formulário abre já com Retrato, Casal e Família selecionado.',
  'area.portrait.cta.button': 'Pedir orçamento de retrato',

  // Páginas de área: Comercial e Audiovisual
  'area.commercial.title': 'Comercial e Audiovisual',
  'area.commercial.tagline': 'Carros, sets de filmagem e projetos sob encomenda.',
  'area.commercial.how.title': 'Como é um trabalho comercial',
  'area.commercial.how.text': 'Tudo começa com uma conversa para entender o que você quer mostrar: um carro, um produto ou um set de filmagem. Depois planejamos o dia de trabalho juntos e eu fotografo com esse objetivo em mente. Você recebe as imagens editadas, prontas para uso.',
  'area.commercial.packages.title': 'Pacotes',
  'area.commercial.package.1': '[Pacote 1: duração, entregas e preço]',
  'area.commercial.package.2': '[Pacote 2: duração, entregas e preço]',
  'area.commercial.package.3': '[Pacote 3: duração, entregas e preço]',
  'area.commercial.cta.title': 'Vamos falar do seu projeto',
  'area.commercial.cta.text': 'O formulário abre já com Comercial e Audiovisual selecionado.',
  'area.commercial.cta.button': 'Pedir orçamento comercial',

  // Metadados de página (título até 60 caracteres, descrição de 80 a 160)
  'meta.home.title': `${BRAND} | Paisagem, retrato e carros`,
  'meta.home.description': 'Fotografia de paisagem, retrato, casal, família, carros e projetos audiovisuais. Veja os trabalhos e peça um orçamento para o seu projeto.',
  'meta.area.landscape.title': `Paisagem e Viagem | ${BRAND}`,
  'meta.area.landscape.description': 'Fotografia de paisagem e viagem: lugares, luz e horizontes. Veja as séries, conheça os pacotes e peça um orçamento para o seu projeto.',
  'meta.area.portrait.title': `Retrato, Casal e Família | ${BRAND}`,
  'meta.area.portrait.description': 'Sessões de retrato, casal e família: pessoas como elas são. Veja as séries, conheça os pacotes e peça um orçamento para a sua sessão.',
  'meta.area.commercial.title': `Comercial e Audiovisual | ${BRAND}`,
  'meta.area.commercial.description': 'Fotografia comercial e audiovisual: carros, sets de filmagem e projetos sob encomenda. Veja as séries e peça um orçamento para o seu projeto.',

  // Textos alternativos das fotos (seguidos do número da foto)
  'alt.landscape': 'Fotografia de paisagem e viagem',
  'alt.portrait': 'Fotografia de retrato, casal e família',
  'alt.commercial': 'Fotografia comercial e audiovisual',
};
