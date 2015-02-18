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
			var command = 'git log --format="format:%an%n%ae%n%aD" --diff-filter=A -- ' + filename;
			return run(command).then(convert).then(setMeta.bind(files, name));
		}).filter(Boolean))
		.then(function() {
			done();
		});
	};
}

function convert(stdout) {
	var out = stdout[0].split('\n');
	return {
		author: out[0],
		email: out[1],
		date: out[2]
	};
}
function setMeta(name, meta) {
	this[name].author = this[name].author || meta.author;
	this[name].date = this[name].date || meta.date && new Date(meta.date);
	this[name].email = this[name].email || meta.email;
}
