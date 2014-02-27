var q = require('q'),
app = require('flatiron').app,
path = require('path'),
child_process = require('child_process');

function run(command) {
	return q.nfcall(
		child_process.exec,
		command,
		{ cwd: path.join(__dirname, '..') }
	);
}

function pull(ref) {
	return run('git status --porcelain')
	.then(function(stdout) {
		app.log.verbose.apply(app.log, stdout);
		return run('git fetch');
	})
	.then(function(stdout) {
		app.log.verbose.apply(app.log, stdout);
		return run('git checkout '+ref);
	})
	.then(function(stdout) {
		app.log.verbose.apply(app.log, stdout);
		app.log.info('Rebuilding from', ref);
		return q.ninvoke(app.wintersmith, 'build');
	});
}

module.exports = function() {
	this.post(function() {
		var body = this.req.body;

		if (!(body.repository && 'refs/heads/'+body.repository.master_branch === body.ref)) {
			this.res.json(this.req.body);
			return;
		}

		app.log.info('Received hook for', body.repository.name);
		pull(body.head_commit.id)
		.then(function(res) {
			this.res.json(res);
		}.bind(this), function(err) {
			this.res.json(err);
		});
	});
};
