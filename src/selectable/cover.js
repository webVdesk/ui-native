export class CoverController {
	constructor(style) {
		this.$element = createSelectionCover(style);
		this.$start = { x: 0, y: 0 };
		
		this.update();
	}

	get element() {
		return this.$element;
	}

	show(start) {
		this.$start = start;
		this.update(start);
		document.body.appendChild(this.$element);
	}

	update(end = { x: 0, y: 0 }) {
		const {
			left, top, width, height
		} = computeRectProperties(this.$start, end);

		Object.assign(this.$element.style, {
			left: `${left}px`,
			top: `${top}px`,
			width: `${width}px`,
			height: `${height}px`,
		});
	}

	hide() {
		this.$start = { x: 0, y: 0 };

		document.body.removeChild(this.$element);
		this.update();
	}
}

const DEFAULT_AREA_STYLE = {
	position: 'fixed',
	backgroundColor: 'rgba(144, 144, 144, 0.3)',
	boxSizing: 'border-box',
	boxShadow: '0 0 0 2px inset #999',
	overflow: 'hidden'
};

const TRANSFER_MATRIX = {
	topLeft: { left: false, top: false, width: -1, height: -1 },
	topRight: { left: true, top: false, width: 1, height: -1 },
	bottomLeft: { left: false, top: true, width: -1, height: 1 },
	bottomRight: { left: true, top: true, width: 1, height: 1 }
};

function encodeTransferMode(start, end) {
	if (end.x < start.x) {
		if (end.y < start.y) {
			return 'topLeft';
		} else {
			return 'bottomLeft';
		}
	} else {
		if (end.y < start.y) {
			return 'topRight';
		} else {
			return 'bottomRight';
		}
	}
}

function computeRectProperties(start, end) {
	const mode = TRANSFER_MATRIX[encodeTransferMode(start, end)];

	return {
		left: mode.left ? start.x : end.x,
		top: mode.top ? start.y : end.y,
		width: (end.x - start.x) * mode.width,
		height: (end.y - start.y) * mode.height
	};
}

function createSelectionCover(style = {}, className = 'vd-selection-area-cover') {
	const areaElemenet = document.createElement('div');

	areaElemenet.className = className;
	Object.assign(areaElemenet.style, DEFAULT_AREA_STYLE, style);

	return areaElemenet;
}

export default function createCover(style) {
	return new CoverController(style);
}