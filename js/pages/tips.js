$(function initTipsPage() {
  $('[data-topic]').on('click', function () {
    $('#tipMessageInput').val($(this).attr('data-topic')).trigger('input').trigger('focus');
  });

  $('#tipSearch').on('input', function () {
    const query = $(this).val().toLowerCase().trim();
    let visibleCount = 0;
    $('.tip-item').each(function () {
      const content = ($(this).attr('data-keywords') + ' ' + $(this).text()).toLowerCase();
      const visible = content.includes(query);
      $(this).toggle(visible);
      if (visible) visibleCount++;
    });
    $('#tipCount').text(visibleCount);
    $('#noResults').prop('hidden', visibleCount !== 0);
  });
});
