(function () {
  // Значки хранятся отдельно от HTML; здесь только создаём нужный SVG.
  const namespace = 'http://www.w3.org/2000/svg';

  function createIcon(name, className = '') {
    const icon = document.createElementNS(namespace, 'svg');
    icon.setAttribute('class', 'k-icon ' + className.replace(/\bk-icon\b/g, '').trim());
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('fill', 'none');
    icon.setAttribute('stroke', 'currentColor');
    icon.setAttribute('stroke-width', '1.6');
    icon.setAttribute('stroke-linecap', 'round');
    icon.setAttribute('stroke-linejoin', 'round');
    icon.setAttribute('aria-hidden', 'true');
    icon.setAttribute('focusable', 'false');
    icon.innerHTML = CookFromHome.iconPaths[name] || '';
    return icon;
  }

  CookFromHome.createIcon = createIcon;
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-icon]').forEach(function (element) {
      element.replaceWith(createIcon(element.dataset.icon, element.className));
    });
  });
})();
