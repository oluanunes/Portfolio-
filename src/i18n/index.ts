import { pt } from './pt';
import { fr } from './fr';
import { en } from './en';

export type Lang = 'pt' | 'fr' | 'en';
export type DictKey = keyof typeof pt;

export const LANGS: Lang[] = ['pt', 'fr', 'en'];
export const DEFAULT_LANG: Lang = 'fr';

const dictionaries: Record<Lang, Record<DictKey, string>> = { pt, fr, en };

export function isLang(value: string): value is Lang {
  return (LANGS as string[]).includes(value);
}

/** Texto da chave no idioma pedido. */
export function t(lang: Lang, key: DictKey): string {
  return dictionaries[lang][key];
}

/**
 * Escolhe o idioma a partir de `navigator.languages`: compara o prefixo antes
 * do hífen (sem diferenciar maiúsculas) e devolve o primeiro suportado, na
 * ordem da lista. Sem correspondência, devolve DEFAULT_LANG.
 */
export function pickLang(navigatorLangs: readonly string[]): Lang {
  for (const tag of navigatorLangs) {
    const prefix = tag.trim().split('-')[0].toLowerCase();
    if (isLang(prefix)) return prefix;
  }
  return DEFAULT_LANG;
}
