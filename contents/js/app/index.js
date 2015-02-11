var nav = document.querySelector('nav'),
underscore = document.createElement('div');
underscore.className = "underscore";

var positionUnderscore = function() {
	var left = this.offsetLeft;
	var width = this.offsetWidth;
	underscore.style.left = `${left}px`;
	underscore.style.width = `${width}px`;
};

document.querySelectorAll('nav .ident')
.forEach(li => li.addEventListener('click', positionUnderscore));

import async from 'nbd/util/async';

nav.appendChild(underscore);
async(positionUnderscore.bind(nav.querySelector('.ident')));

import hljs from 'hljs';
document.querySelectorAll('pre code')
.forEach(block => hljs.highlightBlock(block));
