document.querySelectorAll('[data-disclosure]').forEach((button) => {
  button.addEventListener('click', function toggleDisclosure() {
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    const expanded = button.getAttribute('aria-expanded') !== 'true';

    button.setAttribute('aria-expanded', String(expanded));
    panel.hidden = !expanded;
  });
});
