---
title: beta.aintaer.com
author: aintaer
---

beta.aintaer.com
===

For the new **aintaer.com**, I wanted to keep things simple, yet still
demonstrate the maximum power enabled by web technologies. The old site was a
mishmash of my hand-coded PHP and a customized WordPress blog. Not really
pretty. Since we're in the age of HTML5, I decided to fully revamp not just the
code behind it, but the entire workflow.

It used to be that in order to maintain control over the content, we looked to
CMS solutions. Being a developer, I have built many, liked few, and want none
going forward. Yet content still had to be managed. Since all we're really
doing when we manage content is manage the iterations of data as things
progress, the entire process of creating content for a site is roughly
analogous to writing code. Now code management I'm familiar with.

## Blacksmithing a site
So research was done and decisions were made. My experience with [markdown][md]
was positive, and since it accounts for about 90% of all the markup I would
want, it was to become the content format. However, markdown requires a
processing step before becoming HTML. I considered various processing methods.
Soon, I found [blacksmith][bs], a node.js based preprocessor for markdown.

*Blacksmith* takes a directory with layouts, partials, metadata and of course
markdown files, and produces the final result as static HTML pages. Because it
is static HTML, this approach incurs nearly no overhead on the webserver. Of
course if I need it, I can still create PHP pages to fill in the few cases
where I would still like completely dynamic content. It is also very simple for
PHP to parse the metadata, since all metadata for *blacksmith* is stored as
JSON.

[md]: http://daringfireball.net/projects/markdown/basics
[bs]: https://github.com/flatiron/blacksmith

## Git rid of the database
By using markdown, JSON, and raw HTML for the site, every part of the site is
in plaintext. However, there is still the problem of how to introduce new
content without a database in sight. By treating the entire site as a coding
project, we can use source code management techniques to keep track of all the
changes. Since I'm a big fan of [git][git] (and GitHub too!), it is the natural
choice for **aintaer.com**. By using GitHub, we can make it the remote upstream
for a local git repository on the webserver.

Say what?

That's right, the webserver simply has a local git repository. In order to
produce the latest version of the site, all that has to be done is to pull
changes from the [upstream GitHub repo][aincom], then run *blacksmith* on it.
The resulting output should be in the public directory that the webserver is
pointed at.

[git]: http://git-scm.com/
[aincom]: https://github.com/Aintaer/aincom

## Captain Webhook
The process of producing the site is still pretty tedious: having to log into
the webserver, issue a git pull and running *blacksmith*. Sure we can automate
all the work to be done with a script, but something still has to kick off the
script.

Fortunately, GitHub offers us [Webhooks][wh]. Webhooks are simply post-receive
hooks on the remote repository at GitHub that curls the address you specify and
POSTs JSON metadata about your latest push to the remote repository. By setting
up a receiving endpoint on the webserver (using a very simple PHP script), we
can have the webserver be notified whenever changes are pushed to the remote
repository, so that it can pull and rebuild the site automatically.

[wh]: https://help.github.com/articles/post-receive-hooks

## Coding as Content
With a bit of setup, we're able to consolidate the content production process
with the coding process. In fact the two become the exact same. I use the same
workflow to edit the data as I do to edit the instructions on what to do with
the data.

One of the major realizations in a generalized computing machine was that
instructions can be treated exactly the same as data. Following the same lead,
I also realized that I wanted to be able to create the site in the manner I
felt most comfortable. That means using vim and not a silly Wordpress
front-end. That means using git and not resorting to an FTP connection. It
means all the lessons the web development community has learned.

Mostly, it means the site will be in beta forever.

