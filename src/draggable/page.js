function preventDefault(event) {
	event.preventDefault();
}

export function disableDefaultBehavior() {
	document.addEventListener('dragstart', preventDefault);
	document.addEventListener('mousedown', preventDefault);
}

export function enableDefaultBehavior() {
	document.removeEventListener('dragstart', preventDefault);
	document.removeEventListener('mousedown', preventDefault);
}