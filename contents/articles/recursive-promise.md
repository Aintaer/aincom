Recursive Promise Chaining
===

One of the problems I commonly have to deal with is asynchronous pagination.
Sometimes a service only returns me a page of results at a time, but the rest
of my application Doesn't Care(tm).
All I want are the results.

So imagine you have a function that returns a Promise:

```js
function getPage(page) {
  return fetch(endpoint, { page });
}
```

What you can do is to attach a collector function that will either return
another Promise, or return the collected results. The mechanism of Promises
allows that if another Promise is returned, it will wait and assume the
resolution of the returned Promise.

```js
getPage(1)
.then(function collect(result) {
	if (!result.hasNext) return result;

	return getPage(result.page + 1)
	.then(collect)
	.then(inner => extend(result, inner));
});
```

Tada! The outermost promise will be a promise for the collected results of all
pages.
