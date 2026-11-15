$(function initHomePage() {
  const $name = $('#welcome-name');
  const $message = $('#welcome-message');

  $('#welcome-button').on('click', function () {
    const name = $name.val().trim();
    if (!name) $name.trigger('focus');
    $message.text(name === '' ? 'Please enter your name first.' : 'Welcome to CookFromHome, ' + name + '!');
  });

  $name.on('keydown', function (event) {
    if (event.key === 'Enter') $('#welcome-button').trigger('click');
  });

  $name.on('input', function () {
    $message.text('Enter your name and press the button.');
  });

  $('.home-form').on('submit', function (event) {
    event.preventDefault();
    const ingredients = $('#ingredients-input').val().trim();
    if (!ingredients) {
      const field = document.getElementById('ingredients-input');
      field.setCustomValidity('Enter a dish or at least one ingredient.');
      field.reportValidity();
      return;
    }
    window.location.href = 'recipes.html?ingredients=' + encodeURIComponent(ingredients);
  });
  $('#ingredients-input').on('input', function () {
    this.setCustomValidity('');
  });
});
