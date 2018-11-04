import { Selectable } from '../../';

const container = document.createElement('div');
Object.assign(container.style, {
	border: '1px solid #000',
	height: '400px',
	position: 'relative',
	backgroundColor: '#3ff'
});

document.body.appendChild(container);

Selectable.createSelectionAreaElement(container);