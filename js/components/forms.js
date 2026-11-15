$(function initForms() {
  function isRequired(value) {
    return value.length > 0;
  }

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isMessage(value) {
    return value.length >= 10 && value.length <= 500;
  }

  function connectForm({ form, fields, confirmation, message }) {
    const $form = $(form);
    if (!$form.length) return;

    const $confirmation = $(confirmation);

    function validateField(field) {
      const $input = $(field.input);
      const valid = field.validate($input.val().trim());

      $input.toggleClass('is-invalid', !valid);
      $input.toggleClass('is-valid', valid);
      $input.attr('aria-invalid', String(!valid));
      $(field.error).prop('hidden', valid);

      return valid;
    }

    $form.on('submit', function checkForm(event) {
      event.preventDefault();
      const results = fields.map(validateField);

      if (results.every(Boolean)) {
        $confirmation.text(message).prop('hidden', false);
      } else {
        $confirmation.prop('hidden', true);
        $form.find('.is-invalid').first().trigger('focus');
      }
    });

    fields.forEach((field) => {
      $(field.input).on('input', function updateValidation() {
        $confirmation.prop('hidden', true);
        if ($(this).attr('aria-invalid') !== undefined) validateField(field);
      });
    });
  }

  connectForm({
    form: '#contactForm',
    fields: [
      { input: '#nameInput', error: '#nameError', validate: isRequired },
      { input: '#emailInput', error: '#emailError', validate: isEmail },
      { input: '#messageInput', error: '#messageError', validate: isMessage },
    ],
    confirmation: '#formSuccess',
    message: 'Your message passed the checks. No email has been sent.',
  });

  connectForm({
    form: '#tipsContactForm',
    fields: [
      { input: '#tipNameInput', error: '#tipNameError', validate: isRequired },
      { input: '#tipEmailInput', error: '#tipEmailError', validate: isEmail },
      { input: '#tipMessageInput', error: '#tipMessageError', validate: isMessage },
    ],
    confirmation: '#tipFormSuccess',
    message: 'Your suggestion passed the checks. Nothing has been sent.',
  });
});
