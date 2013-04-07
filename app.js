var flatiron = require('flatiron'),
    path = require('path'),
    app = flatiron.app;

/**
 * Application configuration
 */

// First look at conf file
app.config.file({ 
	file: path.join(__dirname, 'config', 'config.json')
});
// Otherwise, defaults here
app.config.defaults({
	root: path.join(__dirname, 'public')
});

/**
 * Middleware
 */
app.use(flatiron.plugins.http, {
	// Union routes
	before: [require('./lib/static')],
	after: []
});

/**
 * Routes
 */
app.router.get('/', function () {
  this.res.json({ 'oh': 'noes!' });
});

// Kickoff
app.start(8080, function() {
	console.log("Started!");
});
