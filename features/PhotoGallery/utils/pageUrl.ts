export function getPageNumberInBrowserUrl() {
	const searchParams = new URLSearchParams(window.location.search);
	const pageNumber = searchParams.get('page');

	if (pageNumber) {
		return Number(pageNumber);
	} else {
		return 1;
	}
}

export function updatePageNumberInBrowserUrl(page) {
	const searchParams = new URLSearchParams(window.location.search);
	searchParams.set('page', page);
	const newRelativePathQuery =
		window.location.pathname + '?' + searchParams.toString();

	/**
	 * Update the browser URL
	 */
	history.pushState(null, '', newRelativePathQuery);
}
