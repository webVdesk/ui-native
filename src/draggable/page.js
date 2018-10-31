function preventMousedownDefault(event) {
	event.preventDefault();
}

export function disableTextSelection() {
	document.addEventListener('mousedown', preventMousedownDefault);
}

export function enableTextSelection() {
	document.removeEventListener('mousedown', preventMousedownDefault);
}