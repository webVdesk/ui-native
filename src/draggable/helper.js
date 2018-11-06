import _ from 'lodash';
import createException from '../utils/exception';

export function ensureHandleIsElement(element) {
	if (!_.isElement(element)) {
		throw createException('Handle must be a HTMLElement', 'construction');
	}
}

export function VdDragEvent(typeName, data, mouseEvent, element) {
	return Object.assign(new CustomEvent(typeName, {
		bubbles: true,
		cancelable: true,
		detail: {
			data,
			left: element.offsetLeft,
			top: element.offsetTop,
		}
	}), {
		clientX: mouseEvent.clientX,
		clientY: mouseEvent.clientY,
		getData() {
			return this.detail.data;
		}
	});
}

export function DefaultOptions() {
	return {
		clone: false,
		mask: true,
		handled: false,
		constraint: false,
		delay: 0,
		threshold: 0,
		axis: null,
		dataFactory: _.noop,
		droppable: false,
		restoreAfterEnd: false,
		useGPU: false,
	};
}

export function isOverThreshold(start, current, threshold) {
	const deltaX = start.x - current.x;
	const deltaY = start.y - current.y;

	return Math.pow(deltaX, 2) + Math.pow(deltaY, 2) > Math.pow(threshold, 2);
}

export function getElementFromPoint({ x, y }, { style }) {
	style.visibility = 'hidden';
	const element = document.elementFromPoint(x, y) || null;
	style.visibility = 'visible';

	return element;
}

export function getPointerClientPosition({
	clientX, clientY
}) {
	return { x: clientX, y: clientY };
}

export function getElementOffsetPosition({
	offsetTop, offsetLeft
}) {
	return { x: offsetLeft, y: offsetTop };
}

export function constraintFilter({
	originOffset: { x, y },
	element,
	parentElement,
}) {
	const maxX = parentElement.offsetWidth - element.offsetWidth;
	const maxY = parentElement.offsetHeight - element.offsetHeight;

	return {
		x: Math.min(Math.max(x, 0), maxX),
		y: Math.min(Math.max(y, 0), maxY),
	};
}

export function computeElementOffset({
	pointerOrigin,
	pointerPresent,
	elementOrigin,
}) {
	return {
		x: elementOrigin.x + pointerPresent.x - pointerOrigin.x,
		y: elementOrigin.y + pointerPresent.y - pointerOrigin.y,
	};
}