var q = require('q'),
throttle = require('nbd/util/throttle'),
sane = require('sane'),
path = require('path');

module.exports = {
	name: 'watcher',
	attach: function() {
		var source = path.resolve(this.config.get('cwd'), this.config.get('source'));
		this.watcher = sane(source, {});
	},
	detach: function() {
		this.watcher.close();
		delete this.watcher;
	},
	init: function(done) {
		var self = this;
		function build() {
			return self.metalsmith.compile()
			.then(function() {
				self.log.info('Rebuilt');
			}, function(err) {
				console.error(err);
				throw err;
			});
		}

		function rebuild() { throttle(build); }
		this.watcher.on('change', rebuild);
		this.watcher.on('add', rebuild);
		this.watcher.on('delete', rebuild);
	}
};
