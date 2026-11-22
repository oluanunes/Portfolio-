import { AREAS, type AreaSlug } from '../content/areas';

/** Campos do formulário de orçamento. Módulo puro: sem DOM nem Astro. */
export type QuoteInput = {
  name: string;
  email: string;
  type: string;
  date: string;
  message: string;
};

export type QuoteErrors = Partial<Record<keyof QuoteInput, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WEB3FORMS_URL = 'https://api.web3forms.com/submit';

/** Só nome e e-mail são obrigatórios. Os erros são chaves do dicionário (a interface traduz). */
export function validateQuote(i: QuoteInput): { ok: true } | { ok: false; errors: QuoteErrors } {
  const errors: QuoteErrors = {};
  if (i.name.trim() === '') errors.name = 'form.error.name';
  if (!EMAIL_RE.test(i.email.trim())) errors.email = 'form.error.email';
  return Object.keys(errors).length === 0 ? { ok: true } : { ok: false, errors };
}

function subjectFor(i: QuoteInput): string {
  return `Pedido de orçamento — ${i.name.trim()}`;
}

/**
 * Envia o pedido ao Web3Forms. Nunca lança: qualquer falha vira 'failed'.
 * Sem chave configurada, não faz nenhuma requisição ('unconfigured').
 */
export async function submitQuote(
  i: QuoteInput,
  deps: { fetch: typeof fetch; accessKey?: string },
): Promise<'sent' | 'failed' | 'unconfigured'> {
  const accessKey = deps.accessKey?.trim();
  if (!accessKey) return 'unconfigured';
  try {
    const response = await deps.fetch(WEB3FORMS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        name: i.name,
        email: i.email,
        type: i.type,
        date: i.date,
        message: i.message,
        subject: subjectFor(i),
        botcheck: '',
      }),
    });
    if (!response.ok) return 'failed';
    const data: unknown = await response.json();
    const success = (data as { success?: unknown } | null)?.success;
    return success === true ? 'sent' : 'failed';
  } catch {
    return 'failed';
  }
}

/** Lê `tipo` da query string (com ou sem `?`). Com valores repetidos vale o primeiro. */
export function parseTipo(search: string): AreaSlug | null {
  const value = new URLSearchParams(search).get('tipo');
  return (AREAS as string[]).includes(value ?? '') ? (value as AreaSlug) : null;
}

/**
 * Link `mailto:` com o pedido já escrito, para a pessoa não perder o texto
 * quando o envio falha. Devolve '' se não há e-mail de contato.
 */
export function buildMailto(email: string, i: QuoteInput): string {
  const to = email.trim();
  if (to === '') return '';
  const body = [
    `Nome: ${i.name}`,
    `E-mail: ${i.email}`,
    `Tipo: ${i.type}`,
    `Data prevista: ${i.date}`,
    '',
    i.message,
  ].join('\r\n');
  return `mailto:${to}?subject=${encodeURIComponent(subjectFor(i))}&body=${encodeURIComponent(body)}`;
}
