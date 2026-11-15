$(function initPlannerPage() {
  const restored = CookFromHome.storage.read('cfh-planner', {});
  const saved = restored && typeof restored === 'object' && !Array.isArray(restored) ? restored : {};
  let selectedPeriod = [3, 5, 7].includes(saved.days) ? saved.days : 7;
  let selectedTarget =
    Number.isInteger(saved.target) && saved.target >= 1000 && saved.target <= 5000 ? saved.target : 2000;
  const eaten = new Set(Array.isArray(saved.eaten) ? saved.eaten.filter((key) => typeof key === 'string') : []);
  let newItemNumber = 0;

  function savePlan() {
    const groceries = $('#checklistGroup .checklist-row')
      .map(function () {
        return {
          name: $(this).find('label').text().trim(),
          checked: $(this).find('input').prop('checked'),
        };
      })
      .get();
    CookFromHome.storage.write('cfh-planner', {
      days: selectedPeriod,
      target: selectedTarget,
      eaten: Array.from(eaten),
      groceries,
    });
  }
  const defaultSchedule = CookFromHome.defaultMealPlan;

  function renderDays(daysCount, targetKcal) {
    const $container = $('#daysContainer').empty();
    const validDays = Math.min(7, Math.max(1, Number(daysCount) || 7));
    const baseTarget = Number(targetKcal) > 0 ? Number(targetKcal) : 2000;
    const ratio = baseTarget / 2000;

    // Three-day period uses Friday–Sunday; five-day period Monday–Friday.
    const selectedDays = validDays === 3 ? defaultSchedule.slice(-3) : defaultSchedule.slice(0, validDays);

    for (const day of selectedDays) {
      const meals = day.meals.map(function (meal) {
        return { tag: meal.tag, name: meal.name, kcal: Math.round(meal.kcal * ratio) };
      });
      // Assign the rounding remainder to the final meal so totals stay exact.
      meals[meals.length - 1].kcal = baseTarget - meals.slice(0, -1).reduce((sum, meal) => sum + meal.kcal, 0);
      const total = baseTarget;

      const $card = $('<article>', { class: 'day-node panel' });
      const $header = $('<div>', { class: 'day-node-header' }).append(
        CookFromHome.createIcon('calendar', 'day-calendar'),
        $('<h2>').text(day.day),
        $('<span>', { class: 'badge-kcal', text: total + ' kcal' })
      );
      const $meals = $('<ul>', { class: 'meal-item-list' });
      const symbols = { Breakfast: 'sun', Lunch: 'bowl', Dinner: 'pot' };

      meals.forEach(function (meal) {
        const key = day.day + '|' + meal.tag;
        const $row = $('<li>', {
          tabindex: 0,
          role: 'button',
          'aria-pressed': String(eaten.has(key)),
          'data-meal-key': key,
        }).toggleClass('eaten', eaten.has(key));
        const $symbol = $('<span>', { class: 'meal-symbol ' + meal.tag.toLowerCase() }).append(
          CookFromHome.createIcon(symbols[meal.tag])
        );
        const $left = $('<div>', { class: 'meal-left' }).append(
          $('<span>', { class: 'meal-tag', text: meal.tag + ':' }),
          $('<span>').text(meal.name)
        );
        const $check = $('<span>', { class: 'meal-check', 'aria-hidden': 'true' }).append(
          CookFromHome.createIcon('check')
        );
        $row.append($symbol, $left, $('<span>', { class: 'meal-cal', text: meal.kcal + ' kcal' }), $check);
        $meals.append($row);
      });
      $container.append($card.append($header, $meals));
    }
  }

  function updatePlan() {
    const field = document.getElementById('targetCalories');
    if (!field.checkValidity()) {
      field.setAttribute('aria-invalid', 'true');
      $('#plan-feedback').text('Choose a daily target between 1000 and 5000 kcal.');
      field.focus();
      return;
    }
    field.setAttribute('aria-invalid', 'false');
    $('#plan-feedback').text('Plan updated.');
    selectedPeriod = Number($('#daysSelect').val());
    selectedTarget = Number($('#targetCalories').val());
    renderDays(selectedPeriod, selectedTarget);
    savePlan();
  }

  // Одна функция для новых покупок и для сохранённого списка.
  function createGroceryRow(name, checked = false) {
    const id = 'grocery-' + ++newItemNumber;
    const $row = $('<div>', { class: 'checklist-row' }).toggleClass('completed', checked);
    const $left = $('<div>', { class: 'checklist-left' }).append(
      $('<input>', { type: 'checkbox', id, checked }),
      $('<label>', { for: id, text: name })
    );
    const $remove = $('<button>', {
      type: 'button',
      class: 'btn-delete-item btn btn--plain btn--icon btn--sm',
      text: '×',
      'aria-label': 'Remove ' + name,
    });
    return $row.append($left, $remove);
  }

  function addNewProduct() {
    const $input = $('#customInput');
    const text = $input.val().trim();
    if (text === '') {
      $input.trigger('focus');
      return;
    }
    if (text.length > 80) return;
    const exists = $('#checklistGroup label')
      .toArray()
      .some((label) => label.textContent.trim().toLowerCase() === text.toLowerCase());
    if (exists) {
      $('#grocery-feedback').text('This item is already on your list.');
      return;
    }
    if ($('#checklistGroup .checklist-row').length >= 100) {
      $('#grocery-feedback').text('Remove an item before adding more (100 item limit).');
      return;
    }
    $('#checklistGroup').append(createGroceryRow(text));
    $input.val('').trigger('focus');
    $('#grocery-feedback').text('Added ' + text + '.');
    savePlan();
  }

  // Delegation also handles elements created later.
  $('#daysContainer').on('click', '.meal-item-list li', function () {
    const $meal = $(this);
    $meal.toggleClass('eaten');
    $meal.attr('aria-pressed', String($meal.hasClass('eaten')));
    const key = $meal.attr('data-meal-key');
    if ($meal.hasClass('eaten')) eaten.add(key);
    else eaten.delete(key);
    savePlan();
  });
  $('#daysContainer').on('keydown', '.meal-item-list li', function (event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      $(this).trigger('click');
    }
  });
  $('.btn-action').on('click', updatePlan);
  $('#targetCalories').on('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      updatePlan();
    }
  });
  $('.btn-add').on('click', addNewProduct);
  $('#customInput').on('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addNewProduct();
    }
  });
  $('#checklistGroup').on('change', 'input[type="checkbox"]', function () {
    $(this).closest('.checklist-row').toggleClass('completed', this.checked);
    savePlan();
  });
  $('#checklistGroup').on('click', '.btn-delete-item', function () {
    const $row = $(this).closest('.checklist-row');
    const name = $row.find('label').text();
    const index = $row.index();
    $row.remove();
    const $remaining = $('#checklistGroup .btn-delete-item');
    ($remaining.length ? $remaining.eq(Math.min(index, $remaining.length - 1)) : $('#customInput')).trigger('focus');
    $('#grocery-feedback').text('Removed ' + name + '.');
    savePlan();
  });

  if (Array.isArray(saved.groceries)) {
    $('#checklistGroup').empty();
    saved.groceries
      .filter((item) => item && typeof item.name === 'string' && item.name.trim() && item.name.length <= 80)
      .slice(0, 100)
      .forEach((item) => {
        $('#checklistGroup').append(createGroceryRow(item.name, item.checked === true));
      });
  }
  $('#checklistGroup .checklist-row').each(function () {
    $(this)
      .find('.btn-delete-item')
      .attr('aria-label', 'Remove ' + $(this).find('label').text());
  });
  $('#daysSelect').val(String(selectedPeriod));
  $('#targetCalories').val(selectedTarget);
  renderDays(selectedPeriod, selectedTarget);
});
