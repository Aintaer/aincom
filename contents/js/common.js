require.config({
	baseUrl: '/js',
	deps: ['app/index'],
	paths: {
		typekit: "//use.typekit.net/dtz5muo",
		hljs: "//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/highlight.min",
		moment: "//cdnjs.cloudflare.com/ajax/libs/moment.js/2.9.0/moment.min"
	}
});

(function typekit() {
	var html = document.documentElement,
	config = {
		kitId: 'dtz5muo',
		scriptTimeout: 3000
	};

	html.classList.add('wf-loading');
	require(['typekit'], function() {
		try {
			Typekit.load(config);
		} catch (tke) {}
	}, function() {
		html.classList.remove('wf-loading');
		html.classList.add('wf-inactive');
	});
})();
