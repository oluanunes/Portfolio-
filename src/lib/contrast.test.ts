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
  const scheme = block.match(/(?:^|[\s;])color-scheme\s*:\s*([^;]+);/);
  if (scheme) vars['color-scheme'] = scheme[1].trim();
  return vars;
}

/** `rgba(r, g, b, a)` sobre um fundo #rrggbb opaco -> #rrggbb resultante. */
function flatten(rgba: string, bgHex: string): string {
  const m = rgba.match(/^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)$/);
  if (!m) throw new Error(`Esperado rgba(r, g, b, a), recebido ${rgba}`);
  const alpha = Number(m[4]);
  const bg = [1, 3, 5].map((i) => parseInt(bgHex.slice(i, i + 2), 16));
  const out = [m[1], m[2], m[3]].map((c, i) => Math.round(Number(c) * alpha + bg[i] * (1 - alpha)));
  return `#${out.map((n) => n.toString(16).padStart(2, '0')).join('')}`;
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
    for (const key of ['bg', 'surface', 'text', 'muted', 'line', 'field-border', 'accent', 'accent-text']) {
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

  it('borda de campos e filtros (--field-border) >= 3:1 contra o fundo e a superfície (WCAG 1.4.11)', () => {
    expect(contrastRatio(flatten(v['field-border'], v.bg), v.bg)).toBeGreaterThanOrEqual(3);
    expect(contrastRatio(flatten(v['field-border'], v.surface), v.surface)).toBeGreaterThanOrEqual(3);
  });

  it('a --line decorativa continua mais fraca que a borda de campos', () => {
    expect(contrastRatio(flatten(v.line, v.bg), v.bg)).toBeLessThan(contrastRatio(flatten(v['field-border'], v.bg), v.bg));
  });

  it('declara color-scheme do tema', () => {
    expect(v['color-scheme']).toBe(name);
  });
});
