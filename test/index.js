import { Draggable } from '../';
import './selectable';

// console.log(Draggable, Selectable, Resizable)

const container = document.createElement('div');
Object.assign(container.style, {
	width: '400px',
	height: '400px',
	position: 'relative',
	backgroundColor: '#f0f0f0',
	overflow: 'scroll'
});

container.addEventListener('scroll', () => {
	console.log(container.scrollLeft, container.scrollTop);
});

const placeholder = document.createElement('div');
Object.assign(placeholder.style, {
	width: '800px',
	height: '800px'
});

const handle = document.createElement('div');
Object.assign(handle.style, {
	width: '40px',
	height: '40px',
	backgroundColor: 'yellow'
});
Draggable.createHandle(handle);

const fakeHandle = document.createElement('div');
Object.assign(fakeHandle.style, {
	width: '40px',
	height: '40px',
	backgroundColor: 'green'
});

const draggableElement = document.createElement('div');
const draggableCtl = new Draggable(draggableElement, {
	handled: true
});

Object.assign(draggableElement.style, {
	left: 0,
	top: 0,
	width: '100px',
	height: '100px',
	backgroundColor: 'red',
	position: 'absolute'
});

draggableElement.appendChild(handle);
draggableElement.appendChild(fakeHandle);
document.body.appendChild(container);
container.appendChild(placeholder);
container.appendChild(draggableElement);

window.addEventListener('dblclick', () => {
	console.log('Check dblclick failed.');
});