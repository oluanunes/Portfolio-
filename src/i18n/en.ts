import type { DictKey } from './index';

/** English dictionary. Same keys as pt.ts, enforced at compile time. */
export const en: Record<DictKey, string> = {
  // Brand, menu and header controls
  'brand.logo': '[SEU NOME]',
  'nav.menuLabel': 'Menu',
  'nav.skipToContent': 'Skip to content',
  'nav.landscape': 'Landscape',
  'nav.portrait': 'Portrait',
  'nav.commercial': 'Commercial',
  'nav.about': 'About',
  'nav.cta': 'Quote',
  'lang.switchLabel': 'Language',
  'theme.toggleLabel': 'Toggle light and dark mode',

  // Footer
  'footer.copyright': '© [SEU NOME]',
  'footer.contact': 'Instagram · [contact email]',

  // Home
  'home.hero.title': 'Landscape, portrait and car photography.',
  'home.hero.sub': 'Request a quote for your project.',
  'home.hero.cta': 'Request a quote',
  'home.hero.secondary': 'See the work',
  'home.areas.label': 'Areas',
  'home.areas.title': 'What do you need?',
  'home.areas.seeSeries': 'View series',
  'home.featured.title': 'Featured series',
  'home.filter.all': 'All',
  'home.filter.landscape': 'Landscape',
  'home.filter.portrait': 'Portrait',
  'home.filter.commercial': 'Commercial',
  'home.series.placeholder': '[Series title]',
  'home.about.title': 'About',
  'home.about.text': '[Write 2 or 3 sentences about you and how you work.]',
  'home.about.cta': 'Get in touch',

  // Quote form
  'form.title': 'Request a quote',
  'form.sub': 'Tell me what you need and by when.',
  'form.name': 'Name',
  'form.email': 'Email',
  'form.type': 'Type of work',
  'form.date': 'Expected date',
  'form.message': 'Message',
  'form.send': 'Send request',
  'form.type.landscape': 'Landscape and Travel',
  'form.type.portrait': 'Portrait, Couple and Family',
  'form.type.commercial': 'Commercial and Film',
  'form.type.other': 'Other',
  'form.sending': 'Sending…',
  'form.sent': 'Request sent. I will get back to you as soon as I can.',
  'form.failed': 'The request could not be sent. Please try again in a moment or use the email option below.',
  'form.unconfigured': 'Sending from the website is not active yet. Use the button below to send the request with your email app.',
  'form.mailtoFallback': 'Send by email',
  'form.error.name': 'Please enter your name.',
  'form.error.email': 'Please enter a valid email address.',

  // Area pages: Landscape and Travel
  'area.landscape.title': 'Landscape and Travel',
  'area.landscape.tagline': 'Places, light and horizons.',
  'area.landscape.how.title': 'How a landscape project works',
  'area.landscape.how.text': '[Describe in 3 or 4 sentences: how you choose the locations, how long it takes, how many photos the client receives and how soon.]',
  'area.landscape.packages.title': 'Packages',
  'area.landscape.package.1': '[Package 1: duration, number of photos and price]',
  'area.landscape.package.2': '[Package 2: duration, number of photos and price]',
  'area.landscape.package.3': '[Package 3: duration, number of photos and price]',
  'area.landscape.cta.title': "Let's talk about your project",
  'area.landscape.cta.text': 'The form opens with Landscape and Travel already selected.',
  'area.landscape.cta.button': 'Request a landscape quote',

  // Area pages: Portrait, Couple and Family
  'area.portrait.title': 'Portrait, Couple and Family',
  'area.portrait.tagline': 'People as they are.',
  'area.portrait.how.title': 'How a session works',
  'area.portrait.how.text': '[Describe in 3 or 4 sentences: where it takes place, how long it lasts, how many photos the client receives and how soon.]',
  'area.portrait.packages.title': 'Packages',
  'area.portrait.package.1': '[Portrait: duration, number of photos and price]',
  'area.portrait.package.2': '[Couple: duration, number of photos and price]',
  'area.portrait.package.3': '[Family: duration, number of photos and price]',
  'area.portrait.cta.title': "Let's book your session",
  'area.portrait.cta.text': 'The form opens with Portrait, Couple and Family already selected.',
  'area.portrait.cta.button': 'Request a portrait quote',

  // Area pages: Commercial and Film
  'area.commercial.title': 'Commercial and Film',
  'area.commercial.tagline': 'Cars, film sets and commissioned projects.',
  'area.commercial.how.title': 'How a commercial project works',
  'area.commercial.how.text': '[Describe in 3 or 4 sentences: how the briefing starts, what a working day looks like, what the client receives and how soon.]',
  'area.commercial.packages.title': 'Packages',
  'area.commercial.package.1': '[Package 1: duration, deliverables and price]',
  'area.commercial.package.2': '[Package 2: duration, deliverables and price]',
  'area.commercial.package.3': '[Package 3: duration, deliverables and price]',
  'area.commercial.cta.title': "Let's talk about your project",
  'area.commercial.cta.text': 'The form opens with Commercial and Film already selected.',
  'area.commercial.cta.button': 'Request a commercial quote',

  // Page metadata (title up to 60 characters, description 80 to 160)
  'meta.home.title': '[SEU NOME] | Landscape, portrait and car photography',
  'meta.home.description': 'Landscape, portrait, couple, family and car photography, plus film projects. Browse the work and request a quote for your project.',
  'meta.area.landscape.title': 'Landscape and Travel | [SEU NOME]',
  'meta.area.landscape.description': 'Landscape and travel photography: places, light and horizons. Browse the series, see the packages and request a quote for your project.',
  'meta.area.portrait.title': 'Portrait, Couple and Family | [SEU NOME]',
  'meta.area.portrait.description': 'Portrait, couple and family sessions: people as they are. Browse the series, see the packages and request a quote for your session.',
  'meta.area.commercial.title': 'Commercial and Film | [SEU NOME]',
  'meta.area.commercial.description': 'Commercial and film photography: cars, film sets and commissioned projects. Browse the series and request a quote for your project.',

  // Textos alternativos das fotos (seguidos do número da foto)
  'alt.landscape': 'Landscape and travel photography',
  'alt.portrait': 'Portrait, couple and family photography',
  'alt.commercial': 'Commercial and film photography',
};
