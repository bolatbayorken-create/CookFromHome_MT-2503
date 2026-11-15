$(function initRecipesPage() {
  const $search = $('#recipes-search');
  const $categories = $('input[name="meal-filter"]');
  const $cards = $('.recipes-grid .recipes-card');
  const $resultCount = $('#recipes-results-count');
  const $noResults = $('#recipes-no-results');

  const incoming = new URLSearchParams(window.location.search).get('ingredients');
  if (incoming) $search.val(incoming);

  function normalise(text) {
    const aliases = {
      eggs: 'egg',
      onions: 'onion',
      carrots: 'carrot',
      potatoes: 'potato',
      tomatoes: 'tomato',
      noodles: 'noodle',
      beans: 'bean',
      cloves: 'clove',
      peppers: 'pepper',
    };
    return text.toLowerCase().replace(/[a-z]+/g, (word) => aliases[word] || word);
  }

  function filterRecipes() {
    const query = $.trim($search.val()).toLowerCase();
    const terms = query
      .split(/[,;]+/)
      .map(function (part) {
        return normalise(part.trim());
      })
      .filter(Boolean);
    const category = $categories.filter(':checked').val() || 'all';
    let matches = 0;

    $cards.each(function () {
      const $card = $(this);
      const title = $card.find('h2').text().toLowerCase();
      const description = $card.find('.recipes-card-body > p').text().toLowerCase();
      const ingredients = $card.find('.recipes-details-body ul').text().toLowerCase();
      const cardCategory = $card.attr('data-category');

      const content = normalise(title + ' ' + description + ' ' + ingredients);
      const matchesText =
        terms.length === 0 ||
        terms.some(function (term) {
          return term.split(/\s+/).every((word) => content.includes(word));
        });
      const matchesCategory = category === 'all' || cardCategory === category;
      const visible = matchesText && matchesCategory;
      $card.toggle(visible);
      if (visible) matches++;
    });
    $resultCount.text('Showing ' + matches + ' of ' + $cards.length + ' recipes');
    $noResults.prop('hidden', matches !== 0);
  }
  $search.on('input', filterRecipes);
  $categories.on('change', filterRecipes);

  $('#recipes-clear-filters').on('click', function () {
    $search.val('');
    $('#recipes-all').prop('checked', true);
    filterRecipes();
    $search.trigger('focus');
  });

  $('.recipe-toggle').on('click', function () {
    const expanded = $(this).attr('aria-expanded') === 'true';
    const title = $(this).closest('.recipes-card').find('h2').text();
    $(this).attr('aria-label', (expanded ? 'View ' : 'Close ') + title + ' recipe');
    $(this)
      .attr('aria-expanded', String(!expanded))
      .html(
        expanded ? 'View recipe <span aria-hidden="true">+</span>' : 'Close recipe <span aria-hidden="true">−</span>'
      );
    $('#' + $(this).attr('aria-controls')).prop('hidden', expanded);
  });
  $('.recipes-card img')
    .on('error', function () {
      $(this).replaceWith($('<div>', { class: 'recipe-photo-empty', text: 'Photo to be added' }));
    })
    .each(function () {
      if (this.complete && !this.naturalWidth) $(this).trigger('error');
    });
  filterRecipes();
  const selectedId = new URLSearchParams(window.location.search).get('recipe');
  if (selectedId && /^[a-z0-9-]{1,50}$/.test(selectedId)) {
    const $selected = $('#recipe-' + selectedId);
    if ($selected.length) {
      $search.val($selected.find('h2').text());
      filterRecipes();
      $selected.find('.recipe-toggle').trigger('click');
    }
  }
});
