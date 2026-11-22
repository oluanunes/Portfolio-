import { t, type DictKey, type Lang } from '../i18n';
import type { AreaSlug } from '../content/areas';

/**
 * Texto alternativo de uma foto de substituição: frase da área no idioma +
 * número da foto (índice base 0 vira número base 1), para cada foto ter um
 * texto próprio.
 */
export function altFor(lang: Lang, area: AreaSlug, index: number): string {
  return `${t(lang, `alt.${area}` as DictKey)} ${index + 1}`;
}
