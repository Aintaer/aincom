/*global Typekit */
require({baseUrl:'js'}, ['jquery'], function($) {
  'use strict';

  var $html = $('html'),
  $doc = $(document.body),
  config = {
    kitId: 'dtz5muo',
    scriptTimeout: 3000
  };

  // Typekit
  $html.addClass('wf-loading');
  require(['//use.typekit.net/'+config.kitId+'.js'], function() {
    try { Typekit.load(config); } catch (tke) {}
  }, function() {
    $html.removeClass('wf-loading').addClass('wf-inactive');
  });

  $('#navigation').on('click', 'li', function() {
    $doc.removeClass()
    .addClass( this.className );
  });

});
