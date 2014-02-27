var q = require('q'),
app = require('flatiron').app,
path = require('path'),
child_process = require('child_process'),
exec = q.bind(child_process.exec);

function run(command) {
	return exec(command, { cwd: path.join(__dirname, '..') });
}

function pull(ref) {
	return run('git fetch')
	.then(function() {
		return run('git checkout '+ref);
	})
	.then(function() {
		return q.ninvoke(app.wintersmith, 'build');
	});
}

module.exports = function() {
	this.get(function() {
		var body = this.req.body;

		if (!body.size) {
			this.res.json(this.req.body);
			return;
		}

		if (body.ref === 'refs/heads/master') {
			pull(body.head);
		}
	});
};
