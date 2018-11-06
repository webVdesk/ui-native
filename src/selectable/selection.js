import Controller from '../controller';
import createCover from './cover';

class Covering {
	constructor() {
		this.collection = [];
		this.appendOnly = false;
	}

	setAppendOnly(value = false) {
		return this.appendOnly = Boolean(value);
	}

	updateFrom(newCollection) {
		const leaveList = this.collection.filter(selectableController => {
			return newCollection.indexOf(selectableController) === -1;
		});

		const enterList = newCollection.filter(selectableController => {
			return this.collection.indexOf(selectableController) === -1;
		});

		if (!this.appendOnly) {
			leaveList.forEach(selectableController => selectableController.setSelected(false));
		}
		
		enterList.forEach(selectableController => selectableController.setSelected(true));

		this.collection = newCollection;
	}
}

export default class SelectionAreaController extends Controller{
	constructor(element, options = {}) {
		super(element, DefaultOptions());
		this.initOptions(options);

		const cover = createCover(this.getOption('style'));
		const covering = this.covering = new Covering();

		const start = { x: 0, y: 0 };
		let selectableList = [];

		const startCover = event => {
			if (!isOverThreshold(start, {
				x: event.clientX,
				y: event.clientY
			}, this.getOption('threshold'))) {
				return;
			}
			
			document.removeEventListener('mousemove', startCover);
			document.removeEventListener('mousemove', cancelCover);
			document.addEventListener('mousemove', updateCover);
			document.addEventListener('mouseup', endCover);

			selectableList = element.querySelectorAll('[vd-selectable]');
			cover.show(start);
		};

		function cancelCover() {
			document.removeEventListener('mousemove', startCover);
			document.removeEventListener('mouseup', cancelCover);
		}

		const updateCover = event => {
			const fullContain = this.getOption('fullContain');

			cover.update({
				x: event.clientX,
				y: event.clientY
			});

			const collection = [];

			selectableList.forEach(selectableElement => {
				const event =
					new VdCoverEvent(collection, cover.element.getBoundingClientRect(), fullContain);

				selectableElement.dispatchEvent(event);
			});

			covering.updateFrom(collection);
		};

		function endCover() {
			cover.hide();

			document.removeEventListener('mousemove', updateCover);
			document.removeEventListener('mouseup', endCover);
		}

		element.addEventListener('mousedown', event => {
			event.preventDefault();

			start.x = event.clientX;
			start.y = event.clientY;

			covering.updateFrom([]);

			document.addEventListener('mousemove', startCover);
			document.addEventListener('mouseup', cancelCover);
		});
	}
}

function DefaultOptions() {
	return {
		className: '',
		style: {},
		threshold: 5,
		fullContain: false
	};
}

function isOverThreshold(start, current, threshold) {
	const deltaX = start.x - current.x;
	const deltaY = start.y - current.y;

	return Math.pow(deltaX, 2) + Math.pow(deltaY, 2) > Math.pow(threshold, 2);
}

function VdCoverEvent(collection, coverRect, fullContain) {
	return new CustomEvent('vd-cover', {
		bubbles: false,
		cancelable: false,
		detail: { collection, coverRect, fullContain }
	});
}