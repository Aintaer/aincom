var Handlebars = require('handlebars'),
moment = require('moment'),
path = require('path'),
fs = require('fs'),
q = require('q');

module.exports = {
	name: 'handlebars',

	init: function(done) {
		var h = this.handlebars;

		h.registerHelper('dateFormat', function(context, block) {
			var m = moment(context);
			if (block.hash.format) return m.format(block.hash.format);
			return m.calendar();
		});

		h.registerHelper('grouped_each', function(every, context, block) {
			var out = "", subcontext = [], i;
			if (context && context.length) {
				for (i = 0; i < context.length; ++i) {
					if (i && !(i % every)) {
						out += block.fn(subcontext);
						subcontext = [];
					}
					subcontext.push(context[i]);
				}
				out += block.fn(subcontext);
			}
			return out;
		});

		var partialPath = this.config.get('partials');
		q.nfcall(fs.readdir, partialPath)
		.then(function(files) {
			return q.all(files.map(function(file) {
				file = path.join(partialPath, file);
				return q.nfcall(fs.readFile, file)
				.then(function(fileContents) {
					return h.registerPartial(
						path.basename(file, '.mustache'),
						fileContents.toString());
				});
			}));
		})
		.then(function() {
			done();
		});
	},

	attach: function() {
		this.handlebars = Handlebars;
	},

	detach: function() {
		delete this.handlebars;
	}
};
