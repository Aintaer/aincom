var blacksmith = require('../node_modules/blacksmith/lib/blacksmith');

module.exports = function(path, callback) {
	blacksmith(path, function(err, res) {
		if (!err) {
			callback();
		} else {
			console.error(err);
		}
	});
};
