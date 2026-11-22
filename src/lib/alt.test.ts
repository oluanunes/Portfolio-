import { describe, expect, it } from 'vitest';
import { LANGS } from '../i18n';
import { AREAS } from '../content/areas';
import { altFor } from './alt';

describe('AREAS', () => {
  it('lista as áreas na ordem do site', () => {
    expect(AREAS).toEqual(['landscape', 'portrait', 'commercial']);
  });
});

describe('altFor', () => {
  it('devolve texto não vazio para toda combinação de idioma, área e índice 0–7', () => {
    for (const lang of LANGS) {
      for (const area of AREAS) {
        for (let i = 0; i < 8; i++) {
          const text = altFor(lang, area, i);
          expect(text.trim().length, `${lang}/${area}/${i}`).toBeGreaterThan(0);
        }
      }
    }
  });

  it('diferencia fotos de índices diferentes', () => {
    for (const lang of LANGS) {
      for (const area of AREAS) {
        expect(altFor(lang, area, 0)).not.toBe(altFor(lang, area, 1));
      }
    }
  });
});
