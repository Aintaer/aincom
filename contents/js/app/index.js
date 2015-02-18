var nav = document.querySelector('nav'),
underscore = document.createElement('div');
underscore.className = "underscore";
nav.appendChild(underscore);

const positionUnderscore = function() {
	let { offsetLeft: left, offsetWidth: width } = this;
	underscore.style.left = `${left}px`;
	underscore.style.width = `${width}px`;
};

nav.addEventListener('click', function(event) {
	const ident = event.target.closest('.ident');
	if (!ident) return;

	positionUnderscore.call(ident);
});

import async from 'nbd/util/async';

async(positionUnderscore.bind(nav.querySelector('.ident')));

/**
 * CSS shenanigans
 */
const link = document.createElement('link');
link.rel = "stylesheet";
link.href = "/css/teengirl.css";
window.teengirlmode = function() {
	if (document.head.contains(link)) {
		document.head.removeChild(link);
	} else {
		document.head.appendChild(link);
	}
};

/**
 * Syntax highlighting
 */
let codeblocks = document.querySelectorAll('pre code');
if (codeblocks.length) {
	require(['hljs'], function(hljs) {
		for (let block of codeblocks) {
			hljs.highlightBlock(block);
		}
	});
}

/**
 * datetime markup
 */
import moment from 'moment';

for (let article of document.querySelectorAll('article')) {
	let date = moment(+article.dataset.date);
	article.querySelector('h1, h2, h3, h4, h5, h6').setAttribute('data-date', date.calendar());
}
