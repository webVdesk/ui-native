export default class Position {
	constructor(element) {
		this.$element = element;

		this.pointerOrigin = { x: 0, y: 0 };
		this.elementOrigin = { x: 0, y: 0 };
		this.parentScrollOrigin = { x: 0, y: 0 };
	}

	get $offsetParent() {
		return this.element.offsetParent;
	}

	constraintFilter() {

	}

	reset(pointerClientPosition) {
		const { offsetTop, offsetLeft } = this.$element;

		this.elementOrigin.x = offsetLeft;
		this.elementOrigin.y = offsetTop;
		this.pointerOrigin.x = pointerClientPosition.x;
		this.pointerOrigin.y = pointerClientPosition.y;
		this.parentScrollOrigin.x = offsetLeft;
		this.parentScrollOrigin.y = offsetTop;
	}

	computeElementOffset(pointerClientPosition, constraint) {

	}
}