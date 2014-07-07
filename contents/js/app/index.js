var nav = document.querySelector('nav'),
underscore = document.createElement('div');
underscore.className = "underscore";

var positionUnderscore = function() {
	var left = this.offsetLeft;
	var width = this.offsetWidth;
	underscore.style.left = `${left}px`;
	underscore.style.width = `${width}px`;
};

document.querySelectorAll('nav li')
.forEach(li => li.addEventListener('click', positionUnderscore));

import async from 'nbd/util/async';

nav.appendChild(underscore);
async(() => positionUnderscore.call(nav.querySelector('.ident')));
