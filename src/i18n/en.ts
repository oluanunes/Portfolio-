import type { DictKey } from './index';
import { BRAND } from '../content/site';

/** English dictionary. Same keys as pt.ts, enforced at compile time. */
export const en: Record<DictKey, string> = {
  // Brand, menu and header controls
  'brand.logo': BRAND,
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
  'footer.copyright': `© ${BRAND}`,

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
  'home.about.title': 'About',
  'home.about.text': "I'm a Brazilian photographer based in French-speaking Switzerland. I photograph landscapes, people and cars, and I like to understand your project properly before I pick up the camera. Write to me and I'll reply with a clear proposal.",
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
  'form.failed': 'The request could not be sent. Please try again in a moment.',
  'form.unconfigured': 'To send your request, use the email button below.',
  'form.mailtoOnly': 'Your request will be sent from your email app.',
  'form.mailtoFallback': 'Send by email',
  'form.mailtoSubject': 'Quote request',
  'form.error.name': 'Please enter your name.',
  'form.error.email': 'Please enter a valid email address.',

  // Area pages: Landscape and Travel
  'area.landscape.title': 'Landscape and Travel',
  'area.landscape.tagline': 'Places, light and horizons.',
  'area.landscape.how.title': 'How a landscape project works',
  'area.landscape.how.text': 'I choose the locations with you, based on the season and the light you are after. I take care of the planning and shoot at the pace of each place. Afterwards I select and edit the best images for you.',
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
  'area.portrait.how.text': 'The session takes place wherever you feel at ease: at home, in town or out in nature. I guide you calmly so the photos stay natural. Afterwards I choose and edit the best images and send them to you.',
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
  'area.commercial.how.text': 'It all starts with a conversation to understand what you want to show: a car, a product or a film set. Then we plan the working day together and I shoot with that goal in mind. You receive the edited images, ready to use.',
  'area.commercial.packages.title': 'Packages',
  'area.commercial.package.1': '[Package 1: duration, deliverables and price]',
  'area.commercial.package.2': '[Package 2: duration, deliverables and price]',
  'area.commercial.package.3': '[Package 3: duration, deliverables and price]',
  'area.commercial.cta.title': "Let's talk about your project",
  'area.commercial.cta.text': 'The form opens with Commercial and Film already selected.',
  'area.commercial.cta.button': 'Request a commercial quote',

  // Page metadata (title up to 60 characters, description 80 to 160)
  'meta.home.title': `${BRAND} | Landscape, portrait and cars`,
  'meta.home.description': 'Landscape, portrait, couple, family and car photography, plus film projects. Browse the work and request a quote for your project.',
  'meta.area.landscape.title': `Landscape and Travel | ${BRAND}`,
  'meta.area.landscape.description': 'Landscape and travel photography: places, light and horizons. Browse the series, see the packages and request a quote for your project.',
  'meta.area.portrait.title': `Portrait, Couple and Family | ${BRAND}`,
  'meta.area.portrait.description': 'Portrait, couple and family sessions: people as they are. Browse the series, see the packages and request a quote for your session.',
  'meta.area.commercial.title': `Commercial and Film | ${BRAND}`,
  'meta.area.commercial.description': 'Commercial and film photography: cars, film sets and commissioned projects. Browse the series and request a quote for your project.',

  // Textos alternativos das fotos (seguidos do número da foto)
  'alt.landscape': 'Landscape and travel photography',
  'alt.portrait': 'Portrait, couple and family photography',
  'alt.commercial': 'Commercial and film photography',
};
