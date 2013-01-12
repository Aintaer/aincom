require(['jquery'], function($) {
  'use strict';

  var $doc = $(document.body);

  $('#navigation').on('click', 'li', function() {
    $doc.removeClass()
    .addClass( this.className );
  });

});
