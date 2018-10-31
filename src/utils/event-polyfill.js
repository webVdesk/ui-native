/**
 * Polyfill from MDN
 * 
 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
 * 
 * Internet Explorer >= 9 adds a CustomEvent object to the window, but
 * with correct implementations, this is a function.
 */

(function () {
	if (typeof window.CustomEvent === 'function') {
		return false;
	}

	function CustomEvent(event, params) {
		params = params || {
			bubbles: false,
			cancelable: false,
			detail: undefined
		};
		var evt = document.createEvent('CustomEvent');
		evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);

		return evt;
	}

	CustomEvent.prototype = window.Event.prototype;

	window.CustomEvent = CustomEvent;
}());