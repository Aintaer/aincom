var flatiron = require('flatiron'),
path = require('path'),
app = flatiron.app,
config = path.join(__dirname, 'config.json');

/**
 * Application configuration
 */

// First look at conf file
app.config.file({
	file: config
});
// Otherwise, defaults here
app.config.defaults({
	output: path.join(__dirname, 'public')
});

/**
 * Plugins
 */
app.use(flatiron.plugins.http, {
	// Middleware
	before: [require('./lib/static')],
	after: []
});

var wintersmith = {
	init : function(done) {
		require('./lib/wintersmith')(config, done);
	}
};
app.use(wintersmith);

/**
 * Routes
 */
app.router.get('/', function () {
	this.res.json({ 'oh': 'noes!' });
});

// Kickoff
app.start(process.env.PORT, function() {
	console.log("Started!");
});
