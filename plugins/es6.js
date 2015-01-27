var to5 = require('6to5'),
minimatch = require('minimatch');

module.exports = plugin;

var isJs = minimatch.filter("**/*.js");

function plugin(options) {
	var ignores = Array.isArray(options.ignore) ?
		options.ignore :
		[options.ignore];

	ignores = ignores.filter(Boolean).map(function(glob) {
	   	return minimatch.filter(glob);
   	});

	return function(files, metalsmith, done) {
		for (var name in files) {
			if (!isJs(name) || ignores.some(matches, name)) continue;
			var result = to5.transform(files[name].contents, options);
			files[name].contents = result.code;
		}
		done();
	};
}

function matches(matcher) {
	return matcher(this);
}
