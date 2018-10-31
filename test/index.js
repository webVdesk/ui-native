import {
	Draggable,
	Selectable,
	Resizable,
} from '../';

// console.log(Draggable, Selectable, Resizable)

const draggableElement = document.createElement('div');
const draggableCtl = new Draggable(draggableElement);

Object.assign(draggableElement.style, {
	width: '100px',
	height: '100px',
	backgroundColor: 'red',
	position: 'absolute'
});

document.body.appendChild(draggableElement);