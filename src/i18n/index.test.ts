import { describe, expect, it } from 'vitest';
import { DEFAULT_LANG, LANGS, pickLang, t, type DictKey } from './index';
import { pt } from './pt';
import { fr } from './fr';
import { en } from './en';
import { BRAND } from '../content/site';

const dicts = { pt, fr, en } as const;

describe('pickLang', () => {
  it('usa o prefixo do idioma', () => {
    expect(pickLang(['pt-BR'])).toBe('pt');
    expect(pickLang(['en-US'])).toBe('en');
    expect(pickLang(['fr-CH'])).toBe('fr');
  });

  it('devolve o primeiro idioma suportado, na ordem da lista', () => {
    expect(pickLang(['de-CH', 'fr-CH'])).toBe('fr');
    expect(pickLang(['de-CH', 'en-GB', 'pt-BR'])).toBe('en');
  });

  it('ignora maiúsculas e minúsculas', () => {
    expect(pickLang(['PT-br'])).toBe('pt');
    expect(pickLang(['EN'])).toBe('en');
  });

  it('cai no idioma padrão quando nada é suportado', () => {
    expect(pickLang(['de'])).toBe('fr');
    expect(pickLang([])).toBe('fr');
    expect(pickLang(['', 'xx-YY'])).toBe(DEFAULT_LANG);
  });
});

describe('constantes', () => {
  it('expõe os três idiomas e o padrão fr', () => {
    expect([...LANGS].sort()).toEqual(['en', 'fr', 'pt']);
    expect(DEFAULT_LANG).toBe('fr');
  });
});

describe('dicionários', () => {
  it('têm exatamente as mesmas chaves', () => {
    const ptKeys = Object.keys(pt).sort();
    expect(Object.keys(fr).sort()).toEqual(ptKeys);
    expect(Object.keys(en).sort()).toEqual(ptKeys);
  });

  it('não têm valores vazios', () => {
    for (const [lang, dict] of Object.entries(dicts)) {
      for (const [key, value] of Object.entries(dict)) {
        expect(value.trim(), `${lang}:${key}`).not.toBe('');
      }
    }
  });

  it('t() devolve o texto do idioma pedido', () => {
    expect(t('pt', 'home.hero.title')).toBe('Fotografia de paisagem, retrato e carros.');
    expect(t('fr', 'home.hero.title')).toBe("Photographie de paysage, de portrait et d'automobile.");
    expect(t('en', 'home.hero.title')).toBe('Landscape, portrait and car photography.');
  });

  it('metadados: título até 60 caracteres e descrição de 80 a 160', () => {
    const keys = (Object.keys(pt) as DictKey[]).filter((k) => k.startsWith('meta.'));
    expect(keys).toContain('meta.home.title');
    expect(keys).toContain('meta.area.commercial.description');
    for (const lang of LANGS) {
      for (const key of keys) {
        const len = t(lang, key).length;
        if (key.endsWith('.title')) {
          expect(len, `${lang}:${key}`).toBeLessThanOrEqual(60);
        } else {
          expect(len, `${lang}:${key}`).toBeGreaterThanOrEqual(80);
          expect(len, `${lang}:${key}`).toBeLessThanOrEqual(160);
        }
      }
    }
  });

  it('o logotipo é a marca, igual em todos os idiomas', () => {
    expect(BRAND).toBe('Luan Nunes Photography');
    for (const lang of LANGS) expect(t(lang, 'brand.logo')).toBe(BRAND);
  });

  it('rodapé e títulos usam a marca', () => {
    for (const lang of LANGS) {
      expect(t(lang, 'footer.copyright')).toBe(`© ${BRAND}`);
      for (const key of Object.keys(pt).filter((k) => /^meta\..*title$/.test(k))) {
        expect(t(lang, key as DictKey), `${lang}:${key}`).toContain(BRAND);
      }
    }
  });

  it('nenhum texto visível tem [SEU NOME] nem instrução entre colchetes (só os modelos de pacotes, desligados)', () => {
    for (const [lang, dict] of Object.entries(dicts)) {
      for (const [key, value] of Object.entries(dict)) {
        if (key.includes('.package.')) continue;
        expect(value, `${lang}:${key}`).not.toMatch(/\[[^\]]*\]/);
      }
    }
  });
});
