import { describe, expect, it, vi } from 'vitest';
import { buildMailto, parseTipo, submitQuote, validateQuote, type QuoteInput } from './quote';

const valid: QuoteInput = {
  name: 'Maria Silva',
  email: 'maria@example.com',
  type: 'portrait',
  date: 'junho de 2027',
  message: 'Sessão de casal ao pôr do sol.',
};

describe('validateQuote', () => {
  it('aceita um pedido válido', () => {
    expect(validateQuote(valid)).toEqual({ ok: true });
  });

  it('aceita pedido só com nome e e-mail (tipo, data e mensagem são opcionais)', () => {
    expect(validateQuote({ ...valid, type: '', date: '', message: '' })).toEqual({ ok: true });
  });

  it('nome vazio dá erro na chave do nome', () => {
    expect(validateQuote({ ...valid, name: '' })).toEqual({
      ok: false,
      errors: { name: 'form.error.name' },
    });
  });

  it('nome só com espaços dá erro', () => {
    expect(validateQuote({ ...valid, name: '   \t ' })).toEqual({
      ok: false,
      errors: { name: 'form.error.name' },
    });
  });

  it('e-mail sem @ dá erro', () => {
    expect(validateQuote({ ...valid, email: 'mariaexample.com' })).toEqual({
      ok: false,
      errors: { email: 'form.error.email' },
    });
  });

  it('e-mail sem ponto no domínio dá erro', () => {
    expect(validateQuote({ ...valid, email: 'maria@example' })).toEqual({
      ok: false,
      errors: { email: 'form.error.email' },
    });
  });

  it('e-mail vazio ou com espaço no meio dá erro; espaços nas pontas são aceitos', () => {
    expect(validateQuote({ ...valid, email: '' }).ok).toBe(false);
    expect(validateQuote({ ...valid, email: 'ma ria@example.com' }).ok).toBe(false);
    expect(validateQuote({ ...valid, email: '  maria@example.com  ' })).toEqual({ ok: true });
  });

  it('devolve os dois erros de uma vez', () => {
    expect(validateQuote({ ...valid, name: '', email: 'x' })).toEqual({
      ok: false,
      errors: { name: 'form.error.name', email: 'form.error.email' },
    });
  });
});

function fakeResponse(body: unknown, init: { ok?: boolean; status?: number } = {}) {
  return {
    ok: init.ok ?? true,
    status: init.status ?? 200,
    json: async () => {
      if (typeof body === 'string') return JSON.parse(body);
      return body;
    },
  } as unknown as Response;
}

describe('submitQuote', () => {
  it('sem chave devolve unconfigured e não chama o fetch', async () => {
    const fetch = vi.fn();
    expect(await submitQuote(valid, { fetch: fetch as unknown as typeof globalThis.fetch })).toBe(
      'unconfigured',
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  it('chave em branco também é unconfigured', async () => {
    const fetch = vi.fn();
    const deps = { fetch: fetch as unknown as typeof globalThis.fetch, accessKey: '   ' };
    expect(await submitQuote(valid, deps)).toBe('unconfigured');
    expect(await submitQuote(valid, { ...deps, accessKey: '' })).toBe('unconfigured');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('fetch que rejeita devolve failed', async () => {
    const fetch = vi.fn().mockRejectedValue(new TypeError('offline'));
    expect(
      await submitQuote(valid, { fetch: fetch as unknown as typeof globalThis.fetch, accessKey: 'k' }),
    ).toBe('failed');
  });

  it('{ success: true } com status OK devolve sent', async () => {
    const fetch = vi.fn().mockResolvedValue(fakeResponse({ success: true }));
    expect(
      await submitQuote(valid, { fetch: fetch as unknown as typeof globalThis.fetch, accessKey: 'k' }),
    ).toBe('sent');
  });

  it('{ success: false } devolve failed', async () => {
    const fetch = vi.fn().mockResolvedValue(fakeResponse({ success: false }));
    expect(
      await submitQuote(valid, { fetch: fetch as unknown as typeof globalThis.fetch, accessKey: 'k' }),
    ).toBe('failed');
  });

  it('HTTP 500 com corpo { success: true } devolve failed', async () => {
    const fetch = vi
      .fn()
      .mockResolvedValue(fakeResponse({ success: true }, { ok: false, status: 500 }));
    expect(
      await submitQuote(valid, { fetch: fetch as unknown as typeof globalThis.fetch, accessKey: 'k' }),
    ).toBe('failed');
  });

  it('JSON inválido devolve failed', async () => {
    const fetch = vi.fn().mockResolvedValue(fakeResponse('<html>oops</html>'));
    expect(
      await submitQuote(valid, { fetch: fetch as unknown as typeof globalThis.fetch, accessKey: 'k' }),
    ).toBe('failed');
  });

  it('success diferente de true (ex.: "true" como texto) devolve failed', async () => {
    const fetch = vi.fn().mockResolvedValue(fakeResponse({ success: 'true' }));
    expect(
      await submitQuote(valid, { fetch: fetch as unknown as typeof globalThis.fetch, accessKey: 'k' }),
    ).toBe('failed');
  });

  it('envia POST JSON para a URL exata com a chave e os campos da pessoa', async () => {
    const fetch = vi.fn().mockResolvedValue(fakeResponse({ success: true }));
    await submitQuote(valid, { fetch: fetch as unknown as typeof globalThis.fetch, accessKey: 'abc-123' });
    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, init] = fetch.mock.calls[0];
    expect(url).toBe('https://api.web3forms.com/submit');
    expect(init.method).toBe('POST');
    expect(init.headers).toEqual({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    expect(JSON.parse(init.body)).toEqual({
      access_key: 'abc-123',
      name: 'Maria Silva',
      email: 'maria@example.com',
      type: 'portrait',
      date: 'junho de 2027',
      message: 'Sessão de casal ao pôr do sol.',
      subject: 'Pedido de orçamento — Maria Silva',
      botcheck: '',
    });
  });
});

describe('parseTipo', () => {
  it('lê tipo com ? inicial', () => {
    expect(parseTipo('?tipo=portrait')).toBe('portrait');
  });

  it('lê tipo sem ? inicial', () => {
    expect(parseTipo('tipo=landscape')).toBe('landscape');
  });

  it('aceita commercial e ignora outros parâmetros', () => {
    expect(parseTipo('?x=1&tipo=commercial')).toBe('commercial');
  });

  it('valor fora das áreas dá null', () => {
    expect(parseTipo('?tipo=xyz')).toBeNull();
    expect(parseTipo('?tipo=other')).toBeNull();
  });

  it('vazio, sem valor ou sem o parâmetro dá null', () => {
    expect(parseTipo('')).toBeNull();
    expect(parseTipo('?')).toBeNull();
    expect(parseTipo('?tipo=')).toBeNull();
    expect(parseTipo('?foo=portrait')).toBeNull();
  });

  it('repetido: o primeiro valor vale', () => {
    expect(parseTipo('?tipo=portrait&tipo=landscape')).toBe('portrait');
    expect(parseTipo('?tipo=xyz&tipo=portrait')).toBeNull();
  });

  it('não diferencia nada além do exato (maiúsculas e lixo dão null)', () => {
    expect(parseTipo('?tipo=PORTRAIT')).toBeNull();
    expect(parseTipo('?tipo=%E0%A4%A')).toBeNull();
    expect(parseTipo('?tipo[]=portrait')).toBeNull();
  });
});

describe('buildMailto', () => {
  it('sem e-mail de contato devolve texto vazio', () => {
    expect(buildMailto('', valid)).toBe('');
    expect(buildMailto('   ', valid)).toBe('');
  });

  it('monta um mailto: com assunto e corpo codificados', () => {
    const url = buildMailto('ola@example.com', valid);
    expect(url.startsWith('mailto:ola@example.com?subject=')).toBe(true);
    const query = new URLSearchParams(url.slice(url.indexOf('?') + 1));
    expect(query.get('subject')).toBe('Pedido de orçamento — Maria Silva');
    const body = query.get('body') ?? '';
    const lines = body.split('\r\n');
    expect(lines).toContain('Nome: Maria Silva');
    expect(lines).toContain('E-mail: maria@example.com');
    expect(lines).toContain('Tipo: portrait');
    expect(lines).toContain('Data prevista: junho de 2027');
    expect(body).toContain('Sessão de casal ao pôr do sol.');
  });

  it('codifica acentos, quebras de linha, & e # da mensagem', () => {
    const message = 'Olá, João & Ana #1\nSegunda linha: 100%';
    const url = buildMailto('ola@example.com', { ...valid, message });
    expect(url).not.toMatch(/[\r\n ]/);
    expect(url).not.toContain('#');
    expect(url.split('?')[1].match(/&/g)).toHaveLength(1); // só o separador subject&body
    expect(url).toContain('%0A');
    expect(url).toContain('%26');
    expect(url).toContain('%23');
    expect(url).toContain('%C3%A1');
    const body = new URLSearchParams(url.slice(url.indexOf('?') + 1)).get('body') ?? '';
    expect(body).toContain(message);
  });
});
