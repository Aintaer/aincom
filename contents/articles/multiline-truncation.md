Multiline Ellipses
===

It's been a long struggle for the designers where I work. Every time there is a
long block of text, the struggle is to balance the amount you display versus
the amount of screen real estate you're willing to give up. Often their designs
will call for the text to be truncated to fill a certain number of lines. If
you've ever tried to do this in CSS you'll know that you can't.

CSS is unfortunately limited in the truncation department. i.e. You can only
truncate a single line of content with `text-overflow: ellipsis;`. There have
been [experiments with ellipses][1], but sadly they're either all
browser-specific, or in the [best case][2] I've found, require precise
measurement of line heights or else the text gets cut off mid-way. (Or my
peeve, when descenders get cut off or ascenders peek through.)

[1]: http://html5hub.com/ellipse-my-text/
[2]: http://www.mobify.com/blog/multiline-ellipsis-in-pure-css/

## Much chagrin was had

Our solution accepted the reality that we're never going to have a perfect
multi-line ellpsis, and focused on the bit we deemed important:

* Can't be ultra slow
* Should work for arbitrary amount of text
* As orthogonal to CSS styling as possible

The last point is probably most important, since the whole idea is to get
pretty-looking truncated text; which means any font face at any size with any
line height. The naive solution was just to take a block of text, then
character-by-character lop off the end, attach the ellipsis, and measure how
much space that took. Rinse and repeat as necessary.

This approach is definitely valid and would work, but isn't very scalable as
long blocks of text will spend forever in the loop of cut-and-measure when
perhaps all you want is the first three lines. We want to reduce where we start
cutting from with a binary search with the help of [HTML5 Range][3].

```js
// First measure a single line's height
var sel = document.createRange();
sel.setStartBefore(textNode);
sel.setEnd(textNode, 1);

var height = sel.getBoundingClientRect().height,
	maxHeight = height * (limit + 0.5),
	length = textNode.length,
	delta = length,
	dir = -1;

// Binary search until the delta is 0 characters
while (delta) {
	delta = ~~(delta / 2);
	length = length + dir * delta;
	sel.setEnd(textNode, length);
	height = sel.getBoundingClientRect().height;
	if (dir * (height - maxHeight) > 0) { dir = -dir; }
}
```

At the end of the binary search, we end up with a `length` equal to the exact
character beyond which the text overflows. From then on, the naive approach is
necessary in order to add an extra ellipsis character and still not break text
overflow.

```js
// Make sure the ellipsis does not wrap
var content = textNode.textContent.substr(0, length);
do {
	textNode.textContent = content + '…';
	sel.setEndAfter(textNode);
	height = sel.getBoundingClientRect().height;
	content = content.substr(0, --length);
}
while (height > maxHeight);
```

## Voila

There we have it, JS aided multi-line truncated ellipses. Try saying that 5
times fast. It's not a perfect solution, since it's a content-enforced
truncation. Container resizes will never give you back more of the text that
was cut. In addition, it only operates on `TextNode`s. Even still it is useful
enough to be relied on.

In our usages, each truncation causes only 1 or 2 reflows as the
ellipsis is added. The majority of the JS does not modify the DOM at all to
measure the text height, thanks to `Range`. The full code lives in our
front-end framework library, [BeFF][4] (Behance Front-end
Framework) as [dom/truncate][5].

Try it out yourself!

[3]: https://developer.mozilla.org/en-US/docs/Web/API/range
[4]: https://github.com/behance/BeFF
[5]: https://github.com/behance/BeFF/blob/master/dom/truncate.js
