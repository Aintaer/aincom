var wintersmith = require('wintersmith'),
flatiron = require('flatiron');

module.exports = {
	name: 'wintersmith',

	init: function(done) {
		this.log.info('Initial Wintersmith build');
		this.wintersmith.build(function(err) {
			if (err) {
				throw err;
			}
			done();
		});
	},

	attach: function(option) {
		var env = wintersmith(option.file);
		this.wintersmith = env;
	},

	detach: function() {
		this.wintersmith.reset();
		delete this.wintersmith;
	}
};
