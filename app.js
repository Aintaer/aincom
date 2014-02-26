var flatiron = require('flatiron'),
path = require('path'),
app = flatiron.app,
config = path.join(__dirname, 'config.json'),

wintersmith = require('./lib/wintersmith');

/**
 * Application configuration
 */

app.config
.argv()
.file({
	file: config
})
.defaults({
	output: path.join(__dirname, 'public'),
	port: 8080
});

/**
 * Plugins
 */
app.use(flatiron.plugins.http, {
	// before: [],
	// after: [],
	// route: {}
});

app.use(wintersmith, {file: config});

/***
 * Routing
 */
app.router.get('/', function() {
	this.res.json({ 'oh': 'noes!' });
});

app.router.post('/jitherb', function() {
	console.log(this.req.body);
	this.res.json(this.req.body);
});

// Kickoff
app.start(app.config.get('port'), function() {
	app.log.info("Application started on port", app.config.get('port'));
});
