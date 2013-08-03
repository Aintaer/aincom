var wintersmith = require('wintersmith');

module.exports = function(config, callback) {
	var env = wintersmith(config);
	env.build(function(err) {
		if (err) throw err;
		callback();
	});
};
