(function initTheme() {
  const storageKey = 'cfh-theme';

  function readTheme() {
    try {
      return localStorage.getItem(storageKey) === 'dark';
    } catch {
      return false;
    }
  }

  // This script runs at the start of body to avoid a flash of the wrong theme.
  document.body.classList.toggle('theme-dark', readTheme());

  document.addEventListener('DOMContentLoaded', function connectThemeButton() {
    const button = document.getElementById('theme-button');

    function applyTheme(dark) {
      document.body.classList.toggle('theme-dark', dark);
      button.textContent = dark ? 'Light theme' : 'Dark theme';
      button.setAttribute('aria-pressed', String(dark));
      button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    }

    applyTheme(document.body.classList.contains('theme-dark'));

    button.addEventListener('click', function toggleTheme() {
      const dark = !document.body.classList.contains('theme-dark');
      applyTheme(dark);

      try {
        localStorage.setItem(storageKey, dark ? 'dark' : 'light');
      } catch {
        // The theme still works for this page when storage is unavailable.
      }
    });
  });
})();
