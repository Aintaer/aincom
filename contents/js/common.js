/*global Typekit */
require([], function() {
	'use strict';

	var html = document.getElementsByTagName("html")[0],
	config = {
		kitId: 'dtz5muo',
		scriptTimeout: 3000
	};

	// Typekit
	html.className += ' wf-loading';
	require(['//use.typekit.net/'+config.kitId+'.js'], function() {
		try { Typekit.load(config); } catch (tke) {}
	}, function() {
		html.className = html.className.replace('wf-loading', 'wf-inactive');
	});

	document.querySelectorAll('nav li').forEach(function(li) {
		li.addEventListener('click', function() {
			document.body.className = this.className;
		});
	});

});
