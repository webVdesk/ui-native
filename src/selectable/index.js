import Controller from '../controller';
import createCover from './cover';

const covering = {
	list: [],
	updateFrom(newList) {

	}
};

export default class SelectableController extends Controller {
	constructor(element, options) {
		super(element, {});

		element.setAttribute('vd-selectable', '');
		element.vdSelected = false;

		element.addEventListener('vd-cover', event => {
			const { collection } = event.detail;

			collection.push(this);

			element.dispatchEvent(new VdSelectEvent('vd-selectenter'));
		});
	}

	setSelected(value = false) {
		this.$element.vdSelected = Boolean(value);
		this.$element.dispatchEvent(new VdSelectEvent('vd-change'));
	}

	static createSelectionAreaElement(element, {
		className = '',
		style = {},
		threshold = 5,
		fullContain = false
	} = {}) {
		const cover = createCover(style);
		const start = { x: 0, y: 0 };

		function startCover(event) {
			if (!isOverThreshold(start, { x: event.clientX, y: event.clientY }, threshold)) {
				return;
			}
			
			document.removeEventListener('mousemove', startCover);
			document.removeEventListener('mousemove', cancelCover);
			document.addEventListener('mousemove', updateCover);
			document.addEventListener('mouseup', endCover);

			cover.show(start);
		}

		function cancelCover() {
			document.removeEventListener('mousemove', startCover);
			document.removeEventListener('mouseup', cancelCover);
		}

		function updateCover(event) {
			cover.update({
				x: event.clientX,
				y: event.clientY
			});
		}

		function endCover() {
			cover.hide();

			document.removeEventListener('mousemove', updateCover);
			document.removeEventListener('mouseup', endCover);
		}

		element.addEventListener('mousedown', event => {
			event.preventDefault();

			start.x = event.clientX;
			start.y = event.clientY;

			document.addEventListener('mousemove', startCover);
			document.addEventListener('mouseup', cancelCover);
		});
	}
}

export function isOverThreshold(start, current, threshold) {
	const deltaX = start.x - current.x;
	const deltaY = start.y - current.y;

	return Math.pow(deltaX, 2) + Math.pow(deltaY, 2) > Math.pow(threshold, 2);
}


/**
 * vd-select-enter
 * vd-select-leave
 * vd-select-change
 */

function VdSelectEvent(typeName) {
	return new CustomEvent(typeName, {
		bubbles: false,
		cancelable: false,
		detail: {}
	});
}

function VdCoverEvent() {

}