I've had it with all these smiths
===

So apparently abandoning open source projects is a favorite pasttime of the
coding community. Which is why some months after adopting [Wintersmith][1], the
spiritual successor to [Blacksmith][2], it was evident that the outstanding
issues with the project were not going to be responded to, much less resolved.

Thus the hunt began again! Fortunately for me this time, somebody has put
together an altogether [excellent page][3] listing all the current static site
generators. I would have gone with Jerkyll, but it's in Ruby.

I *suck* at Ruby.

After checking out all the competitors, it looks like [Metalsmith][4] was my
best bet. Yet another smith. But maybe this time it will be different! The
architecture was dead simple. Pick up all the files. Run them through plugins.
Dump out all the files.

[1]: https://github.com/flatiron/blacksmith
[2]: https://github.com/jnordberg/wintersmith
[3]: https://www.staticgen.com
[4]: http://www.metalsmith.io

## Not so fast

Of course it's not that easy. What I wanted to do was never really "supported"
anyway. One of the things I hated about existing static site generators is the
verbosity of metadata information: who wrote what when with what title...

That's boring. All that information should be either in the commit log or
inferred from the content. So I wrote a little plugin to commit such a sin.

```js
function plugin(options) {
	options = options || {};
	options.pattern = options.pattern || "**/*.md";
	return function(files, metalsmith, done) {
		var src = metalsmith.source();
		q.all(Object.keys(files).map(function(name) {
			if (!minimatch(name, options.pattern)) return;
			var filename = path.join(src, name);
			filename = path.relative(metalsmith.directory(), filename);
			var command = 'git log --format="format:%ae%n%aD" --diff-filter=A -- ' + filename;
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
		email: out[0],
		date: new Date(out[1])
	};
}
function setMeta(name, meta) {
	this[name].date = this[name].date || meta.date;
	this[name].email = this[name].email || meta.email;
}
```

Now I know it's not the greatest practice to run shell commands, especially
when it is to query the git database, but the alternative is to run libgit,
which I didn't feel like attempting. Shell commands are quick and easy,
especially when the scope is limited to only markdown files.

## Plugin it in

Metalsmith's architecture, as I mentioned, is exceedingly simple and elegant.
By gluing together the plugins made available, you're able to create a pretty
sophisticated pipeline for generating static content with a great deal of
metainformation visibility.

Since all files are read into a single global data collection, along with its
own metadata, local and global metadata, it becomes pretty simple to come with
the conceptual model of how you want your pages to lay out. So far, counting
the 3 custom plugins I wrote, aintaer.com is running with just 9 plugins in the
pipeline.

In comparison to Wintersmith's rigid rendering pipeline, Metalsmith feels more
modern. Allowing more to be done by doing less wins every day in my book.
