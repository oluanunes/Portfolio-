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
/** Tempo máximo de espera pelo Web3Forms antes de tratar o envio como falha. */
export const SUBMIT_TIMEOUT_MS = 15_000;

/** Só nome e e-mail são obrigatórios. Os erros são chaves do dicionário (a interface traduz). */
export function validateQuote(i: QuoteInput): { ok: true } | { ok: false; errors: QuoteErrors } {
  const errors: QuoteErrors = {};
  if (i.name.trim() === '') errors.name = 'form.error.name';
  if (!EMAIL_RE.test(i.email.trim())) errors.email = 'form.error.email';
  return Object.keys(errors).length === 0 ? { ok: true } : { ok: false, errors };
}

/** Assunto do e-mail que chega à fotógrafa pelo Web3Forms (ela lê em português). */
function subjectFor(i: QuoteInput): string {
  return `Pedido de orçamento — ${i.name.trim()}`;
}

/**
 * Envia o pedido ao Web3Forms. Nunca lança: qualquer falha (rede, resposta ruim,
 * demora acima de `timeoutMs`, padrão 15 s) vira 'failed'.
 * Sem chave configurada, não faz nenhuma requisição ('unconfigured').
 */
export async function submitQuote(
  i: QuoteInput,
  deps: { fetch: typeof fetch; accessKey?: string; timeoutMs?: number },
): Promise<'sent' | 'failed' | 'unconfigured'> {
  const accessKey = deps.accessKey?.trim();
  if (!accessKey) return 'unconfigured';

  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(new Error('timeout'));
    }, deps.timeoutMs ?? SUBMIT_TIMEOUT_MS);
  });

  const request = async (): Promise<'sent' | 'failed'> => {
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
      signal: controller.signal,
    });
    if (!response.ok) return 'failed';
    const data: unknown = await response.json();
    const success = (data as { success?: unknown } | null)?.success;
    return success === true ? 'sent' : 'failed';
  };

  try {
    return await Promise.race([request(), timeout]);
  } catch {
    return 'failed';
  } finally {
    clearTimeout(timer);
  }
}

/** Lê `tipo` da query string (com ou sem `?`). Com valores repetidos vale o primeiro. */
export function parseTipo(search: string): AreaSlug | null {
  const value = new URLSearchParams(search).get('tipo');
  return (AREAS as string[]).includes(value ?? '') ? (value as AreaSlug) : null;
}

/** Rótulos já traduzidos do rascunho de e-mail (o módulo continua puro e sem dicionários). */
export type MailtoLabels = {
  /** Início do assunto; o nome da pessoa vem depois de " — ". */
  subject: string;
  name: string;
  email: string;
  type: string;
  date: string;
};

/**
 * Link `mailto:` com o pedido já escrito, para a pessoa não perder o texto
 * quando o envio falha. Devolve '' se não há e-mail de contato. `i.type` entra
 * como está: quem chama passa o rótulo traduzido do tipo, não o slug.
 */
export function buildMailto(email: string, i: QuoteInput, labels: MailtoLabels): string {
  const to = email.trim();
  if (to === '') return '';
  const subject = `${labels.subject} — ${i.name.trim()}`;
  const body = [
    `${labels.name}: ${i.name}`,
    `${labels.email}: ${i.email}`,
    `${labels.type}: ${i.type}`,
    `${labels.date}: ${i.date}`,
    '',
    i.message,
  ].join('\r\n');
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
