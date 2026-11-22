import type { DictKey } from './index';
import { BRAND } from '../content/site';

/** Dictionnaire en français (suisse). Mêmes clés que pt.ts, vérifiées à la compilation. */
export const fr: Record<DictKey, string> = {
  // Marque, menu et contrôles de l'en-tête
  'brand.logo': BRAND,
  'nav.menuLabel': 'Menu',
  'nav.skipToContent': 'Aller au contenu',
  'nav.landscape': 'Paysage',
  'nav.portrait': 'Portrait',
  'nav.commercial': 'Commercial',
  'nav.about': 'À propos',
  'nav.cta': 'Devis',
  'lang.switchLabel': 'Langue',
  'theme.toggleLabel': 'Basculer entre mode clair et sombre',

  // Pied de page
  'footer.copyright': `© ${BRAND}`,

  // Accueil
  'home.hero.title': "Photographie de paysage, de portrait et d'automobile.",
  'home.hero.sub': 'Demandez un devis pour votre projet.',
  'home.hero.cta': 'Demander un devis',
  'home.hero.secondary': 'Voir les travaux',
  'home.areas.label': 'Domaines',
  'home.areas.title': 'De quoi avez-vous besoin ?',
  'home.areas.seeSeries': 'Voir la série',
  'home.featured.title': 'Séries à la une',
  'home.filter.all': 'Toutes',
  'home.filter.landscape': 'Paysage',
  'home.filter.portrait': 'Portrait',
  'home.filter.commercial': 'Commercial',
  'home.about.title': 'À propos',
  'home.about.text': "Je suis photographe brésilien et je vis en Suisse romande. Je photographie des paysages, des personnes et des voitures, et je prends le temps de bien comprendre votre projet avant de lever l'appareil. Écrivez-moi : je vous réponds avec une proposition claire.",
  'home.about.cta': 'Me contacter',

  // Formulaire de devis
  'form.title': 'Demandez un devis',
  'form.sub': 'Dites-moi ce dont vous avez besoin et pour quand.',
  'form.name': 'Nom',
  'form.email': 'E-mail',
  'form.type': 'Type de projet',
  'form.date': 'Date prévue',
  'form.message': 'Message',
  'form.send': 'Envoyer la demande',
  'form.type.landscape': 'Paysage et Voyage',
  'form.type.portrait': 'Portrait, Couple et Famille',
  'form.type.commercial': 'Commercial et Audiovisuel',
  'form.type.other': 'Autre',
  'form.sending': 'Envoi en cours…',
  'form.sent': 'Demande envoyée. Je vous réponds dans les meilleurs délais.',
  'form.failed': "La demande n'a pas pu être envoyée. Réessayez dans un instant.",
  'form.unconfigured': 'Pour envoyer votre demande, utilisez le bouton e-mail ci-dessous.',
  'form.mailtoOnly': 'La demande sera envoyée depuis votre messagerie.',
  'form.mailtoFallback': 'Envoyer par e-mail',
  'form.mailtoSubject': 'Demande de devis',
  'form.error.name': 'Indiquez votre nom.',
  'form.error.email': 'Indiquez une adresse e-mail valide.',

  // Pages de domaine : Paysage et Voyage
  'area.landscape.title': 'Paysage et Voyage',
  'area.landscape.tagline': 'Lieux, lumière et horizons.',
  'area.landscape.how.title': 'Comment se déroule un projet de paysage',
  'area.landscape.how.text': "Je choisis les lieux avec vous, selon la saison et la lumière que vous recherchez. Je m'occupe de la préparation et je photographie au rythme de chaque endroit. Ensuite, je sélectionne et je retouche les meilleures images pour vous.",
  'area.landscape.packages.title': 'Forfaits',
  'area.landscape.package.1': '[Forfait 1 : durée, nombre de photos et prix]',
  'area.landscape.package.2': '[Forfait 2 : durée, nombre de photos et prix]',
  'area.landscape.package.3': '[Forfait 3 : durée, nombre de photos et prix]',
  'area.landscape.cta.title': 'Parlons de votre projet',
  'area.landscape.cta.text': "Le formulaire s'ouvre avec Paysage et Voyage déjà sélectionné.",
  'area.landscape.cta.button': 'Demander un devis paysage',

  // Pages de domaine : Portrait, Couple et Famille
  'area.portrait.title': 'Portrait, Couple et Famille',
  'area.portrait.tagline': "Des personnes telles qu'elles sont.",
  'area.portrait.how.title': 'Comment se déroule une séance',
  'area.portrait.how.text': "La séance a lieu là où vous vous sentez à l'aise : chez vous, en ville ou dans la nature. Je vous guide calmement pour que les photos restent naturelles. Ensuite, je choisis et je retouche les meilleures images, puis je vous les envoie.",
  'area.portrait.packages.title': 'Forfaits',
  'area.portrait.package.1': '[Portrait : durée, nombre de photos et prix]',
  'area.portrait.package.2': '[Couple : durée, nombre de photos et prix]',
  'area.portrait.package.3': '[Famille : durée, nombre de photos et prix]',
  'area.portrait.cta.title': 'Réservons votre séance',
  'area.portrait.cta.text': "Le formulaire s'ouvre avec Portrait, Couple et Famille déjà sélectionné.",
  'area.portrait.cta.button': 'Demander un devis portrait',

  // Pages de domaine : Commercial et Audiovisuel
  'area.commercial.title': 'Commercial et Audiovisuel',
  'area.commercial.tagline': 'Voitures, plateaux de tournage et projets sur commande.',
  'area.commercial.how.title': 'Comment se déroule un projet commercial',
  'area.commercial.how.text': "Tout commence par un échange pour comprendre ce que vous voulez montrer : une voiture, un produit ou un plateau de tournage. Ensuite, nous préparons ensemble la journée de travail et je photographie avec cet objectif en tête. Vous recevez les images retouchées, prêtes à l'emploi.",
  'area.commercial.packages.title': 'Forfaits',
  'area.commercial.package.1': '[Forfait 1 : durée, livrables et prix]',
  'area.commercial.package.2': '[Forfait 2 : durée, livrables et prix]',
  'area.commercial.package.3': '[Forfait 3 : durée, livrables et prix]',
  'area.commercial.cta.title': 'Parlons de votre projet',
  'area.commercial.cta.text': "Le formulaire s'ouvre avec Commercial et Audiovisuel déjà sélectionné.",
  'area.commercial.cta.button': 'Demander un devis commercial',

  // Métadonnées de page (titre jusqu'à 60 caractères, description de 80 à 160)
  'meta.home.title': `${BRAND} | Paysage, portrait et auto`,
  'meta.home.description': "Photographie de paysage, de portrait, de couple, de famille, d'automobile et projets audiovisuels. Découvrez les travaux et demandez un devis.",
  'meta.area.landscape.title': `Paysage et Voyage | ${BRAND}`,
  'meta.area.landscape.description': 'Photographie de paysage et de voyage : lieux, lumière et horizons. Découvrez les séries, consultez les forfaits et demandez un devis pour votre projet.',
  'meta.area.portrait.title': `Portrait, Couple et Famille | ${BRAND}`,
  'meta.area.portrait.description': "Séances de portrait, de couple et de famille : des personnes telles qu'elles sont. Découvrez les séries, les forfaits et demandez un devis.",
  'meta.area.commercial.title': `Commercial et Audiovisuel | ${BRAND}`,
  'meta.area.commercial.description': 'Photographie commerciale et audiovisuelle : voitures, plateaux de tournage et projets sur commande. Découvrez les séries et demandez un devis.',

  // Textos alternativos das fotos (seguidos do número da foto)
  'alt.landscape': 'Photographie de paysage et de voyage',
  'alt.portrait': 'Photographie de portrait, de couple et de famille',
  'alt.commercial': 'Photographie commerciale et audiovisuelle',
};
