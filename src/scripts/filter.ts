import { filterSeries } from '../lib/filter';
import type { AreaSlug } from '../content/areas';

type Filter = AreaSlug | 'all';

function init(root: HTMLElement) {
  const chips = Array.from(root.querySelectorAll<HTMLButtonElement>('button[data-filter]'));
  const items = Array.from(root.querySelectorAll<HTMLElement>('[data-area]')).map((el) => ({
    el,
    area: el.dataset.area as AreaSlug,
  }));

  function apply(filter: Filter) {
    for (const chip of chips) {
      chip.setAttribute('aria-pressed', String(chip.dataset.filter === filter));
    }
    const visible = new Set(filterSeries(items, filter));
    for (const item of items) {
      item.el.hidden = !visible.has(item);
    }
  }

  for (const chip of chips) {
    chip.addEventListener('click', () => apply(chip.dataset.filter as Filter));
  }
}

document.querySelectorAll<HTMLElement>('[data-featured]').forEach(init);
