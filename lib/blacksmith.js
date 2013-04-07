var blacksmith = require('blacksmith');

module.exports = function(path, callback) {
	blacksmith(path, function(err, res) {
		if (!err) {
			callback();
		} else {
			console.error(err);
		}
	});
};
