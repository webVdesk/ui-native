import Controller from '../controller';
import SelectionAreaController from './selection';

export default class SelectableController extends Controller {
	constructor(element, options) {
		super(element, {});

		element.setAttribute('vd-selectable', '');
		element.vdSelected = false;

		element.addEventListener('vd-cover', event => {
			const { collection, coverRect, fullContain } = event.detail;
			
			if (this.isContained(coverRect, fullContain)) {
				collection.push(this);
			}

			element.dispatchEvent(new VdSelectEvent('vd-selectenter'));
		});

		element.addEventListener('vd-select-cancel', () => {
			this.setSelected(false);
		});
		
		element.addEventListener('click', () => {
			this.setSelected(!element.vdSelected);
		});
	}

	isContained(coverRect, full = false) {
		const rect = this.$element.getBoundingClientRect();
		
		return coverRect.left < rect.left + rect.width &&
			coverRect.left + coverRect.width > rect.left &&
			coverRect.top < rect.top + rect.height &&
			coverRect.height + coverRect.top > rect.top;
	}

	setSelected(value = false) {
		this.$element.vdSelected = Boolean(value);
		this.$element.dispatchEvent(new VdSelectEvent('vd-change'));
	}

	static createSelectionAreaElement(element, options = {}) {
		return new SelectionAreaController(element, options);
	}
}

function VdSelectEvent(typeName) {
	return new CustomEvent(typeName, {
		bubbles: false,
		cancelable: false,
		detail: {}
	});
}