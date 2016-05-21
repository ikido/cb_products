'use strict';

// opens path relative to url in new page (tab)
export function openPath(url) {
	window.open(`${window.location.protocol}//${window.location.hostname}${url}`, '_blank');
}