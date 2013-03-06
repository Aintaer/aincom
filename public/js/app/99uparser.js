require({baseUrl:'js'}, ['jquery', 'nbd/util/pipe'], function($, pipe) {
  'use strict';

  var cleanup,
  $dirty = $('#dirty'),
  $clean = $('#clean');

  cleanup = pipe(
  function firstletter(input) {
    var needle = '</div>',
    ignore = false,
    k = input.indexOf(needle);

    if (k<0) { return input; }
    k += needle.length;

    for(k; k<input.length; ++k) {
      if (input[k]==='>') { ignore = false; }
      if (ignore) { continue; }
      if (input[k]==='<') { ignore = true; }
      if (/[a-z]/i.test(input[k])) { break; }
    }
    if (k===input.length) { return input; }
    return input.substring(0,k) + '<span class="dropcap">'+ input[k] + '</span>' + input.substring(k+1);
  },

  function unstrong(input) {
    return input.replace(/(<\/?)strong>/gi, '$1h3>');
  },

  function u99(input) {
    return input.replace(/99%/g, '99U');
  },

  function undiv(input) {
    return input.replace(/<\/?div>/gi, '');
  },

  function tagswap(input) {
    var $c = $('<div>').append(input);

    $c.find('span.pullquote, span.blockquote').each(function() {
      var $this = $(this);
      $this.replaceWith( $('<div>', {'class':this.className}).append($this.html()) );
    });
    return $c.html();
  }
  );


  $('#awesomeize').on('click', function() {
    $clean.val( cleanup($dirty.val()) );
  });
});
