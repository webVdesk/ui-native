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

const selectionArea = Selectable.createSelectionAreaElement(container, {
	fullContain: true,
	className: 'customs',
	style: {
		backgroundColor: 'rgba(66,255, 33, .2)'
	}
});

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

	// selectable.addEventListener('vd-change', event => {
	// 	const { target } = event;

	// 	if (target.vdSelected) {
	// 		target.style.boxShadow = '0 0 4px 2px #000';
	// 	} else {
	// 		target.style.boxShadow = 'none';
	// 	}
	// });

	selectable.addEventListener('vd-coverenter', event => {
		event.target.style.boxShadow = '0 0 2px 2px #000';
	});

	selectable.addEventListener('vd-coverleave', event => {
		event.target.style.boxShadow = '';
	});

	selectable.addEventListener('vd-cover', event => {
		event.target.style.boxShadow = '0 0 2px 2px yellow';

		selectionArea.setOption('style', {
			backgroundColor: `rgba(${rInt(0,255)}, ${rInt(0,255)}, ${rInt(0,255)},.6)`
		});
		
		selectionArea.setOption('fullContain', !selectionArea.getOption('fullContain'));
	});

	container.appendChild(selectable);
}

document.body.appendChild(container);

document.body.addEventListener('keydown', event => {
	
});

document.body.addEventListener('keyup', event => {
	
});