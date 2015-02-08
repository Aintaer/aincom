var q = require('q'),
child_process = require('child_process'),
app = require('flatiron').app;

function run(command) {
	return q.nfcall(
		child_process.exec,
		command,
		{ cwd: app.config.get('cwd') }
	)
	.then(function(stdout) {
		if (app.log) {
			app.log.verbose.apply(app.log, stdout);
		}
		return stdout;
	});
}

module.exports = run;
