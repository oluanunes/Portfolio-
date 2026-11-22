// Aplica o tema antes da primeira pintura (carregado no <head>, sem defer).
// Espelha `resolveTheme` em src/lib/theme.ts: só 'light' e 'dark' valem
// (comparação exata, com diferença entre maiúsculas e minúsculas); qualquer
// outro valor cai na preferência do sistema. Sem JavaScript, vale o padrão
// escuro definido em :root.
(function () {
  var stored = null;
  try {
    stored = localStorage.getItem('theme');
  } catch (e) {}
  var theme =
    stored === 'light' || stored === 'dark'
      ? stored
      : window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark';
  document.documentElement.dataset.theme = theme;
})();
