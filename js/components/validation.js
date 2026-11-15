(function () {
  // Одни и те же проверки для контактных форм и аккаунта.
  function validateField(field) {
    const value = field.value.trim();
    const rule = field.dataset.check;
    let error = '';

    if (!value) error = 'Please fill in this field.';
    else if (rule === 'name' && value.length < 2) error = 'Enter at least 2 characters.';
    else if (rule === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = 'Enter a valid email address, for example name@example.com.';
    } else if (rule === 'phone') {
      const digits = value.replace(/\D/g, '');
      if (!/^\+?[\d\s()-]+$/.test(value) || digits.length < 10 || digits.length > 15) {
        error = 'Use 10–15 digits, with an optional +, spaces, brackets or hyphens.';
      }
    } else if (rule === 'password') {
      if (
        field.value.length < 8 ||
        !/[a-z]/.test(field.value) ||
        !/[A-Z]/.test(field.value) ||
        !/\d/.test(field.value)
      ) {
        error = 'Use at least 8 characters, including an uppercase letter, a lowercase letter and a number.';
      }
    } else if (rule === 'confirm' && field.value !== field.form.querySelector('[name="password"]').value) {
      error = 'The passwords do not match.';
    } else if (rule === 'message' && value.length < 10) {
      error = 'Write at least 10 characters.';
    }
    if (field.maxLength > 0 && field.value.length > field.maxLength) {
      error = 'Use no more than ' + field.maxLength + ' characters.';
    }

    const message = document.getElementById(field.dataset.error);
    message.textContent = error;
    message.hidden = !error;
    field.classList.toggle('is-invalid', Boolean(error));
    field.classList.toggle('is-valid', !error);
    field.setAttribute('aria-invalid', String(Boolean(error)));
    return !error;
  }

  CookFromHome.validateForm = function (form) {
    const fields = Array.from(form.querySelectorAll('[data-check]'));
    const results = fields.map(validateField);
    const invalid = fields.find((field, index) => !results[index]);
    if (invalid) invalid.focus();
    return results.every(Boolean);
  };

  $('[data-check]').on('input', function () {
    $(this.form).find('[data-form-status]').prop('hidden', true);
    if (this.hasAttribute('aria-invalid')) validateField(this);
    if (this.dataset.check === 'password') {
      const confirmation = this.form.querySelector('[data-check="confirm"]');
      if (confirmation && confirmation.hasAttribute('aria-invalid')) validateField(confirmation);
    }
  });

  $('[data-local-form]').on('submit', function (event) {
    event.preventDefault();
    const $status = $(this).find('[data-form-status]');
    $status.prop('hidden', true);
    if (CookFromHome.validateForm(this)) {
      $status.text('Your message passed the checks. Nothing has been sent.').prop('hidden', false);
    }
  });
})();
