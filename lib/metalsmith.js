var Metalsmith = require('metalsmith'),
path = require('path');

module.exports = {
	name: 'metalsmith',

	init: function(done) {
		var plugins = this.config.get('plugins');
		Object.keys(plugins).forEach(function(name) {
			var plugin;
			try {
				if (~name.indexOf(path.sep)) {
					plugin = require(path.relative(__dirname, name));
				}
				else {
					plugin = require(name);
				}
			}
			catch(e) {
				this.log.warn("Plugin not found:", name);
			}
			if (typeof plugin === 'function') {
				this.log.info('Using ' + name);
				this.metalsmith.use(plugin(plugins[name]));
			}
		}, this);

		this.log.info('Metalsmith build');
		this.metalsmith.build(function(err) {
			if (err) { throw err; }
			done();
		});
	},

	attach: function() {
		this.metalsmith = new Metalsmith(this.config.get('cwd'))
		.source(this.config.get('source'))
		.destination(this.config.get('output'))
		.metadata(this.config.get('locals'));
	},

	detach: function() {
		delete this.metalsmith;
	}
};
