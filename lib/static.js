var flatiron = require('flatiron'),
	ecstatic = require('ecstatic');

module.exports = ecstatic({
	root: flatiron.app.config.get('output'),
	autoIndex: true,
	showDir: false,
	defaultExt: 'html',
	handleError: false
});
