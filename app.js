var flatiron = require('flatiron'),
path = require('path'),
app = flatiron.app,
config = path.join(__dirname, 'config.json');

var metalsmith = require('./lib/metalsmith');

/**
 * Application configuration
 */
app.config
.argv()
.file({
	file: config
})
.defaults({
	plugins: {},
	output: path.join(__dirname, 'public'),
	port: 8080
});

app.config.set('cwd', __dirname);

/**
 * Plugins
 */
app.use(metalsmith);
app.use(flatiron.plugins.http);

/***
 * Routing
 */
app.router.get('/', function() {
	this.res.writeHead(200, {
		'Content-Type': 'application/json; charset=utf8'
	});
	this.res.end(JSON.stringify({ 'ヽ(・_・)ノ': 'what?' }));
});

app.router.path('/jitherb', require('./lib/update'));

// Kickoff
app.start(app.config.get('port'), function() {
	app.log.info("Application started on port", app.config.get('port'));
});
