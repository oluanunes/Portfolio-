import type { ImageMetadata } from 'astro';
import type { AreaSlug } from '../content/areas';

export { altFor } from './alt';

const modules = import.meta.glob<ImageMetadata>(
  '/src/assets/photos/*/*.{jpg,jpeg,png,webp}',
  { eager: true, import: 'default' },
);

/**
 * Fotos de uma área, em ordem natural de nome de arquivo (01, 02, ... 10).
 * As fotos reais substituem os arquivos de substituição mantendo os nomes.
 */
export function listPhotos(area: AreaSlug): ImageMetadata[] {
  return Object.entries(modules)
    .filter(([path]) => path.split('/').at(-2) === area)
    .sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true }))
    .map(([, image]) => image);
}
