import type { AreaSlug } from '../content/areas';

/**
 * Itens de uma área (ou todos, com 'all'), na ordem original.
 * Sempre devolve uma lista nova; nunca altera a recebida.
 */
export function filterSeries<T extends { area: AreaSlug }>(
  items: T[],
  filter: AreaSlug | 'all',
): T[] {
  return filter === 'all' ? [...items] : items.filter((item) => item.area === filter);
}
