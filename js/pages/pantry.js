$(function initPantryPage() {
  const $input = $('#pantry-new-product');
  const $list = $('#pantry-product-list');
  const $feedback = $('#pantry-add-feedback').attr({ role: 'status', 'aria-live': 'polite' });
  const restored = CookFromHome.storage.read('cfh-pantry', []);
  let products = Array.isArray(restored)
    ? restored.filter((item) => typeof item === 'string' && item.trim() && item.length <= 80).slice(0, 100)
    : [];

  function feedback(message) {
    $feedback.text(message);
  }
  function render() {
    $list.empty();
    products.forEach((name) => {
      const $row = $('<li>');
      $row.append(
        $('<span>').text(name),
        $('<button>', {
          type: 'button',
          class: 'btn btn--quiet btn--sm',
          text: 'Remove',
          'aria-label': 'Remove ' + name,
        })
      );
      $list.append($row);
    });
    $('.foods button').each(function () {
      const stocked = products.some((name) => name.toLowerCase() === $(this).text().trim().toLowerCase());
      $(this).toggleClass('is-stocked', stocked).prop('disabled', stocked);
    });
    $('#pantry-item-count').text(products.length);
    $('#pantry-empty-list').toggle(products.length === 0);
    CookFromHome.storage.write('cfh-pantry', products);
  }
  function addProduct(value) {
    const name = value.trim();
    if (!name || name.length > 80) {
      feedback('Enter an ingredient name of up to 80 characters.');
      $input.trigger('focus');
      return false;
    }
    if (products.some((item) => item.toLowerCase() === name.toLowerCase())) {
      feedback(name + ' is already in your pantry.');
      return false;
    }
    if (products.length >= 100) {
      feedback('Your pantry contains 100 ingredients. Remove an item before adding another.');
      return false;
    }
    products.push(name);
    render();
    feedback('Added ' + name + '.');
    return true;
  }
  $('#pantry-add-form').on('submit', function (event) {
    event.preventDefault();
    if (addProduct($input.val())) $input.val('');
  });
  $('#add-pantry-basics').on('click', function () {
    ['Eggs', 'Rice', 'Onions'].forEach((name) => {
      if (!products.some((item) => item.toLowerCase() === name.toLowerCase())) addProduct(name);
    });
    feedback('Added eggs, rice and onions.');
    $list.find('button').first().trigger('focus');
  });
  $('.foods button').on('click', function () {
    addProduct($(this).text());
  });
  $list.on('click', 'button', function () {
    const index = $(this).closest('li').index();
    const removed = products.splice(index, 1)[0];
    render();
    feedback('Removed ' + removed + '.');
    const $next = $list
      .children()
      .eq(Math.min(index, products.length - 1))
      .find('button');
    ($next.length ? $next : $input).trigger('focus');
  });
  $('.cook-now-btn').on('click', function (event) {
    if (!products.length) return;
    event.preventDefault();
    window.location.href = 'recipes.html?ingredients=' + encodeURIComponent(products.join(', '));
  });
  render();
});
