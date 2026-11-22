import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { contrastRatio } from './contrast';

const css = readFileSync(new URL('../styles/tokens.css', import.meta.url), 'utf8');

function readTheme(selector: string): Record<string, string> {
  const start = css.indexOf(selector);
  if (start === -1) throw new Error(`Seletor não encontrado em tokens.css: ${selector}`);
  const open = css.indexOf('{', start);
  const close = css.indexOf('}', open);
  const block = css.slice(open + 1, close);
  const vars: Record<string, string> = {};
  for (const m of block.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
    vars[m[1]] = m[2].trim();
  }
  return vars;
}

const themes = {
  dark: readTheme(':root'),
  light: readTheme('[data-theme="light"]'),
};

describe('contrastRatio', () => {
  it('preto sobre branco é 21', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 2);
  });

  it('aceita hex em maiúsculas e minúsculas', () => {
    expect(contrastRatio('#FFFFFF', '#000000')).toBeCloseTo(21, 2);
  });

  it('lança erro claro para entrada que não é #rrggbb', () => {
    expect(() => contrastRatio('red', '#ffffff')).toThrow(/#rrggbb/);
    expect(() => contrastRatio('#fff', '#ffffff')).toThrow(/#rrggbb/);
    expect(() => contrastRatio('rgba(0,0,0,0.5)', '#ffffff')).toThrow(/#rrggbb/);
    expect(() => contrastRatio('#ffffff', '#12345g')).toThrow(/#rrggbb/);
  });
});

describe.each(['dark', 'light'] as const)('contraste do tema %s (lido de tokens.css)', (name) => {
  const v = themes[name];

  it('define todas as variáveis', () => {
    for (const key of ['bg', 'surface', 'text', 'muted', 'line', 'accent', 'accent-text']) {
      expect(v[key], `--${key}`).toBeTruthy();
    }
  });

  it('texto sobre fundo >= 4,5', () => {
    expect(contrastRatio(v.text, v.bg)).toBeGreaterThanOrEqual(4.5);
  });

  it('secundário sobre fundo >= 4,5', () => {
    expect(contrastRatio(v.muted, v.bg)).toBeGreaterThanOrEqual(4.5);
  });

  it('secundário sobre superfície >= 4,5', () => {
    expect(contrastRatio(v.muted, v.surface)).toBeGreaterThanOrEqual(4.5);
  });

  it('texto sobre destaque >= 4,5', () => {
    expect(contrastRatio(v['accent-text'], v.accent)).toBeGreaterThanOrEqual(4.5);
  });
});
