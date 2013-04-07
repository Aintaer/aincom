var ecstatic = require('ecstatic');

module.exports = ecstatic({
	root: app.config.get('root'),
	autoIndex: true,
	showDir: false,
	defaultExt: 'html',
	handleError: false
});
