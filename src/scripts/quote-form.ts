import { AREAS } from '../content/areas';
import {
  buildMailto,
  parseTipo,
  submitQuote,
  validateQuote,
  type MailtoLabels,
  type QuoteInput,
} from '../lib/quote';

type Messages = Record<string, string>;
type Field = 'name' | 'email';

function init(form: HTMLFormElement) {
  const messages: Messages = JSON.parse(form.dataset.i18n ?? '{}');
  const accessKey = form.dataset.accessKey ?? '';
  const contactEmail = form.dataset.contactEmail ?? '';

  const nameInput = form.querySelector<HTMLInputElement>('#f-name')!;
  const emailInput = form.querySelector<HTMLInputElement>('#f-email')!;
  const typeSelect = form.querySelector<HTMLSelectElement>('#f-type')!;
  const dateInput = form.querySelector<HTMLInputElement>('#f-date')!;
  const messageInput = form.querySelector<HTMLTextAreaElement>('#f-message')!;
  const botcheck = form.querySelector<HTMLInputElement>('input[name="botcheck"]')!;
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const status = form.querySelector<HTMLElement>('[data-status]')!;
  const mailto = form.querySelector<HTMLAnchorElement>('[data-mailto]')!;
  const address = form.querySelector<HTMLElement>('[data-mailto-address]')!;
  const fallback = form.querySelector<HTMLElement>('[data-fallback]')!;
  const fields: Record<Field, { input: HTMLInputElement; error: HTMLElement }> = {
    name: { input: nameInput, error: form.querySelector<HTMLElement>('#f-name-error')! },
    email: { input: emailInput, error: form.querySelector<HTMLElement>('#f-email-error')! },
  };

  const text = (key: string) => messages[key] ?? key;

  // Link vindo de ?tipo=: só vale se for uma área conhecida; senão o select mantém o padrão.
  const tipo = parseTipo(location.search);
  if (tipo && (AREAS as string[]).includes(tipo)) typeSelect.value = tipo;

  function readInput(): QuoteInput {
    return {
      name: nameInput.value,
      email: emailInput.value,
      type: typeSelect.value,
      date: dateInput.value,
      message: messageInput.value,
    };
  }

  function clearFeedback() {
    for (const { input, error } of Object.values(fields)) {
      input.removeAttribute('aria-invalid');
      error.textContent = '';
    }
    status.textContent = '';
    mailto.hidden = true;
    mailto.removeAttribute('href');
    address.hidden = true;
    address.textContent = '';
    fallback.hidden = true;
  }

  // Rótulos do rascunho de e-mail na língua da página (o tipo vai pelo nome, não pelo slug).
  function mailtoLabels(): MailtoLabels {
    return {
      subject: text('form.mailtoSubject'),
      name: text('form.name'),
      email: text('form.email'),
      type: text('form.type'),
      date: text('form.date'),
    };
  }

  function showFallback(message: string, input: QuoteInput) {
    status.textContent = message;
    const typeLabel = text(`form.type.${input.type}`);
    const url = buildMailto(contactEmail, { ...input, type: typeLabel }, mailtoLabels());
    if (url) {
      mailto.textContent = text('form.mailtoFallback');
      mailto.href = url;
      mailto.hidden = false;
      // O endereço também em texto puro: quem usa webmail não tem app de e-mail e precisa copiá-lo.
      address.textContent = ` · ${contactEmail.trim()}`;
      address.hidden = false;
      fallback.hidden = false;
    }
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearFeedback();

    const input = readInput();
    const result = validateQuote(input);
    if (!result.ok) {
      let firstInvalid: HTMLInputElement | null = null;
      for (const field of ['name', 'email'] as const) {
        const key = result.errors[field];
        if (!key) continue;
        fields[field].error.textContent = text(key);
        fields[field].input.setAttribute('aria-invalid', 'true');
        firstInvalid ??= fields[field].input;
      }
      firstInvalid?.focus();
      return;
    }

    // Isca preenchida: é robô. Finge sucesso e não envia nada.
    if (botcheck.checked) {
      status.textContent = text('form.sent');
      form.reset();
      return;
    }

    // Sem chave do Web3Forms não há o que enviar pelo site: vai direto ao e-mail.
    if (accessKey.trim() === '') {
      showFallback(text('form.unconfigured'), input);
      return;
    }

    button.disabled = true;
    status.textContent = text('form.sending');
    let outcome: 'sent' | 'failed';
    try {
      const result = await submitQuote(input, { fetch: window.fetch.bind(window), accessKey });
      outcome = result === 'sent' ? 'sent' : 'failed';
    } catch (error) {
      console.error('Falha inesperada ao enviar o pedido de orçamento', error);
      outcome = 'failed';
    }
    button.disabled = false;

    if (outcome === 'sent') {
      status.textContent = text('form.sent');
      form.reset();
    } else {
      showFallback(text('form.failed'), readInput());
    }
  });
}

document.querySelectorAll<HTMLFormElement>('form[data-quote-form]').forEach(init);
