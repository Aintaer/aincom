/**
 * Typekit
 */
var html = document.documentElement,
config = {
	kitId: 'dtz5muo',
	scriptTimeout: 3000
};

html.classList.add('wf-loading');
require([`//use.typekit.net/${config.kitId}.js`], () => {
	try {
		Typekit.load(config);
	} catch (tke) {}
}, () => {
	html.classList.remove('wf-loading');
	html.classList.add('wf-inactive')
});
