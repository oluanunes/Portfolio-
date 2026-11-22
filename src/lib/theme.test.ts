import { describe, expect, it } from 'vitest';
import { resolveTheme } from './theme';

describe('resolveTheme', () => {
  it('respeita a escolha guardada', () => {
    expect(resolveTheme('light', false)).toBe('light');
    expect(resolveTheme('dark', true)).toBe('dark');
  });

  it('sem escolha guardada, segue a preferência do sistema', () => {
    expect(resolveTheme(null, true)).toBe('light');
    expect(resolveTheme(null, false)).toBe('dark');
  });

  it('valor inválido é ignorado e cai na preferência do sistema', () => {
    expect(resolveTheme('lixo', false)).toBe('dark');
    expect(resolveTheme('lixo', true)).toBe('light');
  });
});
