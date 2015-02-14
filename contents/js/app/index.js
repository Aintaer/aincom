var nav = document.querySelector('nav'),
underscore = document.createElement('div');
underscore.className = "underscore";

var positionUnderscore = function() {
	var left = this.offsetLeft;
	var width = this.offsetWidth;
	underscore.style.left = `${left}px`;
	underscore.style.width = `${width}px`;
};

for (let li of document.querySelectorAll('nav li')) {
	li.addEventListener('click', positionUnderscore);
}

import async from 'nbd/util/async';

nav.appendChild(underscore);
async(positionUnderscore.bind(nav.querySelector('.ident')));

let codeblocks = document.querySelectorAll('pre code');
if (codeblocks.length) {
	require(['hljs'], function(hljs) {
		for (let block of codeblocks) {
			hljs.highlightBlock(block);
		}
	});
}

import moment from 'moment';

for (let article of document.querySelectorAll('article')) {
	let date = moment(+article.dataset.date);
	article.querySelector('h1, h2, h3, h4, h5, h6').setAttribute('data-date', date.calendar());
}
