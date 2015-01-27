var Metalsmith = require('metalsmith'),
path = require('path'),
app = require('flatiron').app;

module.exports = {
	name: 'metalsmith',

	init: function(done) {
		this.log.info('Metalsmith build');
		this.metalsmith.build(function(err) {
			if (err) { throw err; }
			done();
		});
	},

	attach: function() {
		this.metalsmith = new Metalsmith(app.config.get('cwd'))
		.source(app.config.get('source'))
		.destination(app.config.get('output'))
		.metadata(app.config.get('locals'));

		var plugins = app.config.get('plugins');
		Object.keys(plugins).forEach(function(name) {
			var plugin;
			try {
				if (~name.indexOf(path.sep)) {
					plugin = require(path.relative(__dirname, name));
				}
				else {
					plugin = require(path);
				}
			}
			catch(e) {
				console.warn("Plugin not found:", name);
			}
			if (typeof plugin === 'function') {
				this.metalsmith.use(plugin(plugins[name]));
			}
		}, this);
	},

	detach: function() {
		delete this.metalsmith;
	}
};
