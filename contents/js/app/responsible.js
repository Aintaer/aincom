import media from 'nbd/util/media';

media({
	vertical: 'all and (orientation: portrait)',
	horizontal: 'all and (orientation: landscape)',
});


import View from 'nbd/View';

var Short = View.extend({
	template: (data) => `<h1>Hello ${data.body}!</h1>`
});

var Long = View.extend({
	template: (data) => `<h1>Goodbye, cruel ${data.body}...</h1>`
});

import Controller from 'nbd/Controller';
import responsive from 'nbd/trait/responsive';

var Message = Controller.extend({}, {
	VIEW_CLASS: {
		vertical: Short,
		horizontal: Long
	}
})
.mixin(responsive);

Message({ body: 'world' }).render(document.querySelector('.content'));
