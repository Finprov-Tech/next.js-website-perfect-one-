(function () {
  function attachCounter(el, min, max) {
    if (!el || el.dataset.seoCounterAttached) return;
    el.dataset.seoCounterAttached = '1';

    var counter = document.createElement('div');
    counter.className = 'seo-char-counter';
    el.insertAdjacentElement('afterend', counter);

    function update() {
      var len = el.value.length;
      counter.textContent = len + ' characters (recommended ' + min + '–' + max + ')';
      counter.classList.remove('seo-counter-green', 'seo-counter-amber', 'seo-counter-red');
      if (len === 0 || len > max) {
        counter.classList.add('seo-counter-red');
      } else if (len < min) {
        counter.classList.add('seo-counter-amber');
      } else {
        counter.classList.add('seo-counter-green');
      }
    }

    el.addEventListener('input', update);
    update();
  }

  document.addEventListener('DOMContentLoaded', function () {
    attachCounter(document.querySelector('input[name$="-seo_title"]'), 50, 60);
    attachCounter(document.querySelector('textarea[name$="-meta_description"]'), 150, 160);
  });
})();
