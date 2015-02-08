var q = require('q'),
run = require('../lib/run'),
minimatch = require('minimatch'),
path = require('path');

module.exports = plugin;

function plugin(options) {
	options = options || {};
	options.pattern = options.pattern || "**/*.md";
	return function(files, metalsmith, done) {
		var src = metalsmith.source();
		q.all(Object.keys(files).map(function(name) {
			if (!minimatch(name, options.pattern)) return;
			var filename = path.join(src, name);
			filename = path.relative(metalsmith.directory(), filename);
			var command = 'git log --format="format:%aI" --diff-filter=A -- ' + filename;
			return run(command).then(convert).then(setDate.bind(files, name));
		}).filter(Boolean))
		.then(function() {
			done();
		});
	};
}

function convert(stdout) {
	return new Date(stdout[0]);
}
function setDate(name, date) {
	this[name].date = date;
}
