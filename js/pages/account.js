$(function () {
  const storage = CookFromHome.storage;
  const saved = storage.read('cfh-users', []);
  const users = Array.isArray(saved) ? saved.filter((user) => user && typeof user.email === 'string') : [];

  function showStatus(form, message) {
    $(form).find('[data-form-status]').text(message).prop('hidden', false);
  }

  $('#signupForm').on('submit', function (event) {
    event.preventDefault();
    $(this).find('[data-form-status]').prop('hidden', true);
    if (!CookFromHome.validateForm(this)) return;
    const email = this.elements.email.value.trim().toLowerCase();
    if (users.some((user) => user.email === email)) {
      showStatus(this, 'This email is already registered. Log in or use another email.');
      this.elements.email.focus();
      return;
    }
    const user = {
      name: this.elements.name.value.trim(),
      email,
      phone: this.elements.phone.value.trim(),
      password: this.elements.password.value,
    };
    // Учебная имитация: данные сохраняются только в этом браузере.
    if (!storage.write('cfh-users', users.concat(user))) {
      showStatus(this, 'Browser storage is unavailable. Allow local storage and try again.');
      return;
    }
    window.location.href = 'login.html?registered=1';
  });

  if (document.getElementById('loginForm')) {
    const query = new URLSearchParams(window.location.search);
    if (query.has('registered')) showStatus('#loginForm', 'Account created. Log in with your email and password.');
    else if (query.has('required')) showStatus('#loginForm', 'Log in to open your profile.');
  }

  $('#loginForm').on('submit', function (event) {
    event.preventDefault();
    $(this).find('[data-form-status]').prop('hidden', true);
    if (!CookFromHome.validateForm(this)) return;
    const email = this.elements.email.value.trim().toLowerCase();
    const user = users.find((user) => user.email === email && user.password === this.elements.password.value);
    if (!user) {
      showStatus(this, 'Email or password is incorrect. Please try again.');
      return;
    }
    if (!storage.write('cfh-session', user.email)) {
      showStatus(this, 'Browser storage is unavailable. Allow local storage and try again.');
      return;
    }
    window.location.href = 'profile.html';
  });

  if (document.getElementById('profileDetails')) {
    const email = storage.read('cfh-session', '');
    const user = users.find((user) => user.email === email);
    if (!user) {
      window.location.replace('login.html?required=1');
      return;
    }
    $('#profile-name').text(user.name);
    $('#profile-email').text(user.email);
    $('#profile-phone').text(user.phone);
    $('#profileDetails').prop('hidden', false);
  }

  $('#logout-button').on('click', function () {
    if (!storage.write('cfh-session', null)) {
      $('#logout-status').text('Could not end the session. Check browser storage and try again.').prop('hidden', false);
      return;
    }
    window.location.replace('login.html');
  });
});
