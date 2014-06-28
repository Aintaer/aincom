import "app/bootstrap";

document.querySelectorAll('nav li')
.forEach(li => li.addEventListener('click', function() {
	document.body.className = this.className;
}));
