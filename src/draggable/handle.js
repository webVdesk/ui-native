function decorateMousedownEvent(event) {
	event.__VD_HANDLE_EVENT__ = true;
}

export function create(element) {
	element.__VD_HANDLE__ = true;
	element.addEventListener('mousedown', decorateMousedownEvent);
}

export function destroy(element) {
	delete element.__VD_HANDLE__;
	element.removeEventListener('mousedown', decorateMousedownEvent);
}