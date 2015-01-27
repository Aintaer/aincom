var q = require('q'),
app = require('flatiron').app,
path = require('path'),
minimatch = require('minimatch'),
child_process = require('child_process');

function run(command) {
	return q.nfcall(
		child_process.exec,
		command,
		{ cwd: app.config.get('cwd') }
	);
}

function fetch() {
	return run('git status --porcelain')
	.then(function(stdout) {
		app.log.verbose.apply(app.log, stdout);
		return run('git fetch');
	});
}

function checkout(ref) {
	app.log.verbose('Checking out', ref);
	return run('git checkout ' + ref +' && git submodule update --init');
}

function diff(ref) {
	var isSource = minimatch.filter(path.join(app.config.get('source'), '**'));
	return run('git diff --name-only ..' + ref)
	.then(function(stdout) {
		app.log.verbose.apply(app.log, stdout);
		// Affects the application
		return stdout && !stdout.every(isSource);
	});
}

function rebuild() {
	app.log.info('Rebuilding Metalsmith');
	return q.ninvoke(app.metalsmith, 'build');
}

module.exports = function() {
	this.post(function() {
		var body = this.req.body,
		send = this.res,
		ref, restart;

		if (!(body.repository && 'refs/heads/'+body.repository.master_branch === body.ref)) {
			this.res.json(this.req.body);
			return;
		}

		app.log.info('Received hook for', body.repository.name);

		ref = body.head_commit.id;
		fetch()
		.then(function() {
			return diff(ref);
		})
		.then(function(different) {
			restart = different;
			return different ? checkout(ref) : checkout(ref).then(rebuild);
		})
		.then(function(res) {
			send.json(res);
		}, function(err) {
			send.json(500, err);
		})
		.then(function() {
			if (restart) {
				process.exit(0);
			}
		});
	});
};
