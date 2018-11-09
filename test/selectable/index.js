import { Selectable } from '../../';

function rInt(from, to) {
	return Math.round(Math.random() * (to - from) + from);
}

const container = document.createElement('div');

Object.assign(container.style, {
	border: '1px solid #000',
	height: '400px',
	position: 'relative',
	backgroundColor: '#3ff'
});

const selectionArea = Selectable.createSelectionAreaElement(container);

const length = rInt(100, 100);

for(let i = 0; i < length; i++) {
	createSelectableElement();
}

function stopPropagation(event) {
	event.stopPropagation();
}

function createSelectableElement() {
	const selectable = document.createElement('div');

	Object.assign(selectable.style, {
		border: '1px solid #000',
		height: '20px',
		float: 'left',
		width: '20px',
		margin: '10px',
		position: 'relative',
		backgroundColor: `rgb(${rInt(0, 255)}, ${rInt(0, 255)}, ${rInt(0, 255)})`
	});

	new Selectable(selectable);

	selectable.addEventListener('mousedown', stopPropagation);

	selectable.addEventListener('vd-change', event => {
		const { target } = event;

		if (target.vdSelected) {
			target.style.boxShadow = '0 0 4px 2px #000';
		} else {
			target.style.boxShadow = 'none';
		}
	});

	container.appendChild(selectable);
}

document.body.appendChild(container);

document.body.addEventListener('keydown', event => {
	selectionArea.setAppendOnly(true);
});

document.body.addEventListener('keyup', event => {
	selectionArea.setAppendOnly(false);
});