/**
 * Degradês (scrims) que ficam entre a foto e o texto branco. Fonte única: os componentes
 * montam o `background` a partir daqui e o teste (scrims.test.ts) mede o contraste com
 * a MESMA lista, então os dois não se afastam. Módulo puro (sem Astro).
 */
export type ScrimStop = { at: number; alpha: number };

/** Posição vertical (0 = topo, 1 = base do bloco do scrim) e transparência de preto. */
export const HERO_SCRIM: ScrimStop[] = [
  { at: 0, alpha: 0.6 },
  { at: 0.22, alpha: 0.15 },
  { at: 0.4, alpha: 0.5 },
  { at: 0.6, alpha: 0.7 },
  { at: 1, alpha: 0.82 },
];

export const CARD_SCRIM: ScrimStop[] = [
  { at: 0.25, alpha: 0 },
  { at: 0.5, alpha: 0.55 },
  { at: 1, alpha: 0.85 },
];

const trim = (n: number) => String(Number(n.toFixed(4)));

/** `linear-gradient(...)` de cima para baixo, com preto transparente nos stops. */
export function scrimGradient(stops: ScrimStop[]): string {
  const parts = stops.map((s) => `rgba(0, 0, 0, ${trim(s.alpha)}) ${trim(s.at * 100)}%`);
  return `linear-gradient(180deg, ${parts.join(', ')})`;
}

/** Transparência do scrim na posição vertical `at` (interpola entre os stops; fora deles vale o mais próximo). */
export function alphaAt(stops: ScrimStop[], at: number): number {
  if (at <= stops[0].at) return stops[0].alpha;
  for (let i = 1; i < stops.length; i++) {
    const a = stops[i - 1];
    const b = stops[i];
    if (at <= b.at) return a.alpha + ((b.alpha - a.alpha) * (at - a.at)) / (b.at - a.at);
  }
  return stops[stops.length - 1].alpha;
}
