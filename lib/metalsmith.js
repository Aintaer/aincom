var metalsmith = require('metalsmith'),
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
		this.metalsmith = new Metalsmith(__dirname)
		.source(app.config.get('source'))
		.destination(app.config.get('output'))
		.metadata(app.config.get('locals'));

		var plugins = app.config.get('plugins');
		Object.keys(plugins).forEach(function(name) {
			var plugin;
			try {
				plugin = require(name);
			}
			catch(e) {
				this.log.error("Plugin not found:", name);
			}
			if (typeof plugin === 'function') {
				this.metalsmith.use(plugins[name]);
			}
		}, this);
	},

	detach: function() {
		delete this.metalsmith;
	}
};
