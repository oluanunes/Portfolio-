import { describe, expect, it } from 'vitest';
import { joinBase } from './url';

describe('joinBase', () => {
  const paths = ['/fr/', '/fr/?tipo=portrait#orcamento', '/theme-init.js'];

  it('com base "/" devolve o caminho intacto', () => {
    expect(joinBase('/', '/fr/')).toBe('/fr/');
    expect(joinBase('/', '/fr/?tipo=portrait#orcamento')).toBe('/fr/?tipo=portrait#orcamento');
    expect(joinBase('/', '/theme-init.js')).toBe('/theme-init.js');
  });

  it('com base "/portfolio/" coloca uma única barra entre base e caminho', () => {
    expect(joinBase('/portfolio/', '/fr/')).toBe('/portfolio/fr/');
    expect(joinBase('/portfolio/', '/fr/?tipo=portrait#orcamento')).toBe(
      '/portfolio/fr/?tipo=portrait#orcamento',
    );
    expect(joinBase('/portfolio/', '/theme-init.js')).toBe('/portfolio/theme-init.js');
  });

  it('aceita base sem barra final', () => {
    expect(joinBase('/portfolio', '/fr/')).toBe('/portfolio/fr/');
    expect(joinBase('/portfolio', '/fr/?tipo=portrait#orcamento')).toBe(
      '/portfolio/fr/?tipo=portrait#orcamento',
    );
    expect(joinBase('/portfolio', '/theme-init.js')).toBe('/portfolio/theme-init.js');
  });

  it('aceita caminho sem barra inicial', () => {
    expect(joinBase('/portfolio/', 'fr/')).toBe('/portfolio/fr/');
    expect(joinBase('/', 'fr/')).toBe('/fr/');
  });

  it('nunca gera barras duplicadas entre base e caminho', () => {
    for (const base of ['/', '/portfolio', '/portfolio/']) {
      for (const p of paths) {
        expect(joinBase(base, p).replace(/^\/+/, '/')).not.toMatch(/^\/portfolio\/\/|^\/\//);
      }
    }
  });
});
