import Controller from '../controller';
import createCover from './cover';

class Covering {
	constructor() {
		this.collection = [];
	}

	updateFrom(newCollection) {
		const leaveList = this.collection.filter(controller => {
			return newCollection.indexOf(controller) === -1;
		});

		const enterList = newCollection.filter(controller => {
			return this.collection.indexOf(controller) === -1;
		});
		
		leaveList.forEach(element => element.dispatchEvent(new VdCoverEvent('vd-coverleave')));
		enterList.forEach(element => element.dispatchEvent(new VdCoverEvent('vd-coverenter')));

		this.collection = newCollection;
	}
}

function isContained(rect, coverRect, full = false) {
	return coverRect.left < rect.left + rect.width &&
		coverRect.left + coverRect.width > rect.left &&
		coverRect.top < rect.top + rect.height &&
		coverRect.height + coverRect.top > rect.top;
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

			selectableList = this.getSelectableList();
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
			const coverRect = cover.element.getBoundingClientRect();

			selectableList.forEach(selectableElement => {
				const rect = selectableElement.getBoundingClientRect();
				
				if (isContained(rect, coverRect, fullContain)) {
					collection.push(selectableElement);
				}
			});

			covering.updateFrom(collection);
		};

		function endCover() {
			cover.hide();

			document.removeEventListener('mousemove', updateCover);
			document.removeEventListener('mouseup', endCover);

			const lastCollection = covering.collection;
			covering.updateFrom([]);

			lastCollection.forEach(element => element.dispatchEvent(new VdCoverEvent('vd-cover')));
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

	getSelectableList() {
		return this.$element.querySelectorAll('[vd-selectable]');
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

function VdCoverEvent(typeName) {
	return new CustomEvent(typeName, {
		bubbles: false,
		cancelable: false,
		detail: {}
	});
}