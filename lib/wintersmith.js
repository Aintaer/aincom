var wintersmith = require('wintersmith');

module.exports = function(config, callback) {
	var env = wintersmith(config);
	wintersmith.build(function(err) {
		if (err) throw err;
		callback();
	});
};
