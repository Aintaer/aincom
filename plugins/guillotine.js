var cheerio = require('cheerio');
module.exports = plugin;

function plugin(options) {
	options = options || {};
	return function(files, metalsmith, done) {
		var collections = metalsmith.metadata().collections;
		for (var file in files) {
			var colName = files[file].paginate,
			collection;

			if (colName && (collection = collections[colName])) {
				collection.forEach(extract);
			}
		}
		done();
	};
}

function extract(item) {
	var $ = cheerio.load(item.contents.toString());
	item.title = item.title || $('h1').first().text();
	item.excerpt = $('p').first().html();
}
