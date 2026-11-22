import { describe, expect, it } from 'vitest';
import type { AreaSlug } from '../content/areas';
import { filterSeries } from './filter';

type Item = { id: number; area: AreaSlug };

const items: Item[] = [
  { id: 1, area: 'landscape' },
  { id: 2, area: 'portrait' },
  { id: 3, area: 'commercial' },
  { id: 4, area: 'landscape' },
  { id: 5, area: 'portrait' },
];

describe('filterSeries', () => {
  it("com 'all' devolve todos os itens, na ordem original", () => {
    expect(filterSeries(items, 'all').map((i) => i.id)).toEqual([1, 2, 3, 4, 5]);
  });

  it("com 'portrait' devolve só os de retrato, na ordem original", () => {
    expect(filterSeries(items, 'portrait').map((i) => i.id)).toEqual([2, 5]);
  });

  it('com lista vazia devolve lista vazia', () => {
    expect(filterSeries([], 'all')).toEqual([]);
    expect(filterSeries([], 'landscape')).toEqual([]);
  });

  it('nunca altera a lista recebida', () => {
    const copy = structuredClone(items);
    filterSeries(items, 'landscape');
    filterSeries(items, 'all');
    expect(items).toEqual(copy);
  });

  it('devolve uma lista nova mesmo com "all"', () => {
    expect(filterSeries(items, 'all')).not.toBe(items);
  });

  it('uma área sem itens devolve []', () => {
    const onlyLandscape: Item[] = [{ id: 1, area: 'landscape' }];
    expect(filterSeries(onlyLandscape, 'commercial')).toEqual([]);
  });
});
