var flatiron = require('flatiron'),
app = flatiron.app,
path = require('path'),
config = path.join(__dirname, 'config.json');

var metalsmith = require('./lib/metalsmith');
var handlebars = require('./lib/handlebars');

var q = require('q'),
throttle = require('nbd/util/throttle'),
sane = require('sane');

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
app.use(handlebars);
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
	function build() {
		return app.metalsmith.compile()
		.then(function() {
			app.log.info('Rebuilt');
		}, function(err) {
			console.error(err);
			throw err;
		});
	}
	function rebuild() { throttle(build); }
	var watcher = sane(app.config.get('source'), {});
	watcher.on('change', rebuild);
	watcher.on('add', rebuild);
	watcher.on('delete', rebuild);
});
