/** Áreas de atuação. Módulo TS puro (sem imports do Astro) para o Vitest poder importá-lo. */
export type AreaSlug = 'landscape' | 'portrait' | 'commercial';

export const AREAS: AreaSlug[] = ['landscape', 'portrait', 'commercial'];
