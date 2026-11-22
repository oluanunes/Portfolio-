/**
 * Junta a base do site (`/` ou `/portfolio/`, com ou sem barra final) a um
 * caminho, deixando sempre exatamente uma barra entre os dois. A barra final,
 * a query (`?`) e o fragmento (`#`) do caminho são mantidos.
 */
export function joinBase(base: string, path: string): string {
  const b = base.replace(/\/+$/, '');
  const p = path.replace(/^\/+/, '');
  return `${b}/${p}`;
}

/** URL interna respeitando a base configurada. Use em TODO link e asset interno. */
export function href(path: string): string {
  return joinBase(import.meta.env.BASE_URL, path);
}
