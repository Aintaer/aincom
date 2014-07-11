import media from 'nbd/util/media';

media({
	vertical: 'all and (orientation: portrait)',
	horizontal: 'all and (orientation: landscape)',
});


import View from 'nbd/View/Entity';

var Short = View.extend({
	template: (data) => `<h1>Hello ${data.body}!</h1>`
});

var Long = View.extend({
	template: (data) => `<h1>Goodbye, cruel ${data.body}...</h1>`
});

import Controller from 'nbd/Controller/Responsive';

var Message = Controller.extend({}, {
	VIEW_CLASS: {
		vertical: Short,
		horizontal: Long
	}
});

Message({ body: 'world' }).render(document.querySelector('.content'));
