$(function initCookNext() {
  const storageKey = 'cfh-cook-next';
  const storage = CookFromHome.storage;
  const createIcon = CookFromHome.createIcon;
  let savedRecipes = readSavedRecipes();

  function getPhotoPath(photo) {
    if (typeof photo !== 'string') return '';

    // Keep selections saved before the asset folders were reorganized.
    const filename = photo.split('/').pop();
    return /^recipe-[a-z-]+\.jpg$/.test(filename) ? `images/recipes/${filename}` : '';
  }

  function isSavedRecipe(recipe) {
    return (
      recipe &&
      typeof recipe.id === 'string' &&
      /^[a-z0-9-]{1,50}$/.test(recipe.id) &&
      typeof recipe.title === 'string' &&
      recipe.title.trim().length > 0 &&
      recipe.title.length <= 80
    );
  }

  function readSavedRecipes() {
    const stored = storage.read(storageKey, []);
    if (!Array.isArray(stored)) return [];

    const recipes = [];
    stored
      .filter(isSavedRecipe)
      .slice(0, 30)
      .forEach((recipe) => {
        if (recipes.some((saved) => saved.id === recipe.id)) return;

        recipes.push({
          id: recipe.id,
          title: recipe.title,
          time: typeof recipe.time === 'string' ? recipe.time.slice(0, 40) : '',
          photo: getPhotoPath(recipe.photo),
        });
      });

    return recipes;
  }

  function renderSaveButtons() {
    $('[data-pick]').each(function updateButton() {
      const $button = $(this);
      const saved = savedRecipes.some((recipe) => recipe.id === $button.attr('data-pick'));
      const title = $button.closest('.recipes-card').find('h2').text();
      const label = saved ? `Remove ${title} from Cook next` : `Save ${title} to Cook next`;

      $button.toggleClass('is-saved', saved);
      $button.attr({
        'aria-pressed': String(saved),
        'aria-label': label,
        title: saved ? 'Saved in Cook next' : 'Save to Cook next',
      });
      $button.empty().append(createIcon(saved ? 'check' : 'note'));
    });
  }

  function createThumbnail(recipe) {
    const $thumbnail = $('<span>', { class: 'pick-thumb' });
    if (!recipe.photo) return $thumbnail.append(createIcon('bowl'));

    const $photo = $('<img>', { src: recipe.photo, alt: '', width: 56, height: 56 });
    $photo.on('error', function showMissingPhoto() {
      $thumbnail.empty().append(createIcon('bowl'));
    });
    return $thumbnail.append($photo);
  }

  function createRecipeCard(recipe) {
    const $card = $('<article>', { class: 'pick-card' });
    const $copy = $('<div>', { class: 'pick-copy' });
    const $link = $('<a>', {
      href: `recipes.html?recipe=${encodeURIComponent(recipe.id)}`,
      text: 'Open recipe',
    });
    const $remove = $('<button>', {
      type: 'button',
      class: 'btn btn--plain btn--icon btn--sm',
      'data-remove-pick': recipe.id,
      'aria-label': `Remove ${recipe.title} from Cook next`,
      text: '×',
    });

    $copy.append($('<h3>').text(recipe.title), $('<p>').text(recipe.time), $link);
    return $card.append(createThumbnail(recipe), $copy, $remove);
  }

  function createEmptyState() {
    const $message = $('<div>').append(
      $('<h3>').text('What would you like to cook?'),
      $('<p>').text('Save a dish from Recipes and it will be waiting here.')
    );
    return $('<div>', { class: 'empty-picks' }).append(createIcon('note'), $message);
  }

  function renderSavedRecipes() {
    renderSaveButtons();
    const $list = $('#recipe-picks');
    if (!$list.length) return;

    $list.empty();
    if (!savedRecipes.length) {
      $list.append(createEmptyState());
      return;
    }
    savedRecipes.forEach((recipe) => $list.append(createRecipeCard(recipe)));
  }

  function saveRecipes() {
    storage.write(storageKey, savedRecipes);
    renderSavedRecipes();
  }

  $('[data-pick]').on('click', function toggleSavedRecipe() {
    const $card = $(this).closest('.recipes-card');
    const id = $(this).attr('data-pick');
    const title = $card.find('h2').text().trim();
    const index = savedRecipes.findIndex((recipe) => recipe.id === id);

    if (index >= 0) {
      savedRecipes.splice(index, 1);
    } else {
      savedRecipes.push({
        id,
        title,
        time: $card.find('.recipes-meta span').first().text().trim(),
        photo: getPhotoPath($card.children('img').attr('src')),
      });
    }

    saveRecipes();
    $('#recipe-pick-feedback').text(`${title} ${index >= 0 ? 'removed from' : 'saved to'} Cook next.`);
  });

  $('#recipe-picks').on('click', '[data-remove-pick]', function removeSavedRecipe() {
    const id = $(this).attr('data-remove-pick');
    const index = savedRecipes.findIndex((recipe) => recipe.id === id);
    if (index < 0) return;

    savedRecipes.splice(index, 1);
    saveRecipes();

    const $buttons = $('#recipe-picks [data-remove-pick]');
    const $nextButton = $buttons.eq(Math.min(index, $buttons.length - 1));
    ($buttons.length ? $nextButton : $('.cook-next-heading a')).trigger('focus');
  });

  renderSavedRecipes();
});
