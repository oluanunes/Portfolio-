import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { contrastRatio } from './contrast';
import { alphaAt, CARD_SCRIM, HERO_SCRIM, scrimGradient, type ScrimStop } from './scrims';

const hex = (v: number) => {
  const n = Math.round(Math.min(255, Math.max(0, v)));
  return `#${n.toString(16).padStart(2, '0').repeat(3)}`;
};

/** Contraste de texto branco (com a opacidade `fgAlpha`) sobre uma foto BRANCA coberta pelo scrim em `at`. */
function whiteOnWhitePhoto(stops: ScrimStop[], at: number, fgAlpha = 1): number {
  const bg = 255 * (1 - alphaAt(stops, at));
  const fg = 255 * fgAlpha + bg * (1 - fgAlpha);
  return contrastRatio(hex(fg), hex(bg));
}

/**
 * Onde o texto começa em cada scrim, em fração da altura do bloco. Medido no navegador
 * (larguras de 320 a 1920 px, 3 idiomas) e arredondado para baixo:
 *  - hero: h1 a partir de 0,378 (320 px); subtítulo 0,661; link secundário 0,825
 *  - hero de área: h1 a partir de 0,527; tagline 0,80
 *  - porta: título 0,484 (360 px); tagline 0,688; "ver série" 0,868
 *  - série: rótulo 0,709 (320 px); nome 0,805
 */
const zones = [
  { name: 'hero / hero de área: título grande', stops: HERO_SCRIM, from: 0.37, fgAlpha: 1, large: true },
  { name: 'hero / hero de área: subtítulo e tagline (branco a 88%)', stops: HERO_SCRIM, from: 0.65, fgAlpha: 0.88, large: false },
  { name: 'porta e série: título grande', stops: CARD_SCRIM, from: 0.48, fgAlpha: 1, large: true },
  { name: 'porta e série: texto pequeno (branco a 88%)', stops: CARD_SCRIM, from: 0.68, fgAlpha: 0.88, large: false },
];

describe('texto branco sobre foto BRANCA com o degradê (pior caso)', () => {
  for (const z of zones) {
    it(`${z.name}: a partir de ${z.from} até a base, contraste >= ${z.large ? 3 : 4.5}`, () => {
      const min = z.large ? 3 : 4.5;
      // varre da posição inicial até a base: o pior ponto não pode ficar abaixo do mínimo
      for (let at = z.from; at <= 1.0001; at += 0.01) {
        expect(whiteOnWhitePhoto(z.stops, at, z.fgAlpha), `${z.name} @${at.toFixed(2)}`).toBeGreaterThanOrEqual(min);
      }
    });

    it(`${z.name}: transparência do preto >= ${z.large ? 0.42 : 0.6} onde o texto começa`, () => {
      expect(alphaAt(z.stops, z.from)).toBeGreaterThanOrEqual(z.large ? 0.42 : 0.6);
    });
  }

  it('o contraste cai de verdade sem o degradê (o teste não é trivial)', () => {
    expect(whiteOnWhitePhoto([{ at: 0, alpha: 0 }], 0.5)).toBeCloseTo(1, 1);
    // o degradê antigo (0 até 40%, 0,78 em 100%) deixava o título do hero sem proteção a 40%
    expect(whiteOnWhitePhoto([{ at: 0, alpha: 0 }, { at: 0.4, alpha: 0 }, { at: 1, alpha: 0.78 }], 0.4)).toBeLessThan(3);
  });
});

describe('scrimGradient / alphaAt', () => {
  it('gera o degradê do hero com os stops combinados', () => {
    expect(scrimGradient(HERO_SCRIM)).toBe(
      'linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.15) 22%, rgba(0, 0, 0, 0.5) 40%, rgba(0, 0, 0, 0.7) 60%, rgba(0, 0, 0, 0.82) 100%)',
    );
  });

  it('gera o degradê dos cards', () => {
    expect(scrimGradient(CARD_SCRIM)).toBe(
      'linear-gradient(180deg, rgba(0, 0, 0, 0) 25%, rgba(0, 0, 0, 0.55) 50%, rgba(0, 0, 0, 0.85) 100%)',
    );
  });

  it('interpola e fixa nas pontas', () => {
    expect(alphaAt(CARD_SCRIM, 0)).toBe(0);
    expect(alphaAt(CARD_SCRIM, 0.375)).toBeCloseTo(0.275, 5);
    expect(alphaAt(CARD_SCRIM, 1)).toBe(0.85);
    expect(alphaAt(CARD_SCRIM, 2)).toBe(0.85);
  });
});

describe('os componentes usam a lista única (sem degradê escrito à mão)', () => {
  for (const name of ['Hero', 'AreaHero', 'Doors', 'FeaturedSeries']) {
    it(`${name}.astro monta o scrim com scrimGradient`, () => {
      const src = readFileSync(new URL(`../components/${name}.astro`, import.meta.url), 'utf8');
      expect(src).toContain('scrimGradient(');
      expect(src).not.toMatch(/linear-gradient\(180deg,\s*rgba\(0,\s*0,\s*0/);
    });
  }
});
