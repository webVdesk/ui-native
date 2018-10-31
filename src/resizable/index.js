import Controller from '../controller';

const DEFAULT_OPTIONS = {
	constraint: null,
	direction: [true, true, true, true]
};

const handleBaseStyle = {
	position: 'absolute',
	userSelect: 'none',
	MsUserSelect: 'none'
};

const handleStyleMapping = {
	top: { width: '100%', height: '8px', top: '-8px', left: '0px', cursor: 'n-resize' },
	right: { width: '8px', height: '100%', top: '0px', right: '-8px', cursor: 'e-resize' },
	bottom: { width: '100%', height: '8px', bottom: '-8px', left: '0px', cursor: 's-resize' },
	left: { width: '8px', height: '100%', top: '0px', left: '-8px', cursor: 'w-resize' },
	topRight: { width: '8px', height: '8px', right: '-8px', top: '-8px', cursor: 'ne-resize' },
	bottomRight: { width: '8px', height: '8px', right: '-8px', bottom: '-8px', cursor: 'se-resize' },
	bottomLeft: { width: '8px', height: '8px', left: '-8px', bottom: '-8px', cursor: 'sw-resize' },
	topLeft: { width: '8px', height: '8px', left: '-8px', top: '-8px', cursor: 'nw-resize' }
};

const handleDeltaMapping = {
	top: [0, 1, 0, -1],
	right: [0, 0, 1, 0],
	bottom: [0, 0, 0, 1],
	left: [1, 0, -1, 0],
	topLeft: [1, 1, -1, -1],
	topRight: [0, 1, 1, -1],
	bottomRight: [0, 0, 1, 1],
	bottomLeft: [1, 0, -1, 1],
};

export default class ResizableController extends Controller {
	constructor(element, options) {
		super(element, DEFAULT_OPTIONS);
		this.initOptions(options);

		this.$handleList = [];

		this.updateHandle();
	}

	updateHandle() {
		this.$handleList.forEach(handleElement => {
			this.element.removeChild(handleElement);
		});

		const newHandles = HandleFragment(this.getOption('direction'), this.element);
		
		newHandles.forEach(handleElement => {
			this.element.appendChild(handleElement);
		});

		this.$handleList = newHandles;
	}

	get() {
		const { offsetHeight, offsetWidth } = this.element;

		return {
			width: offsetWidth,
			height: offsetHeight
		};
	}

	set({ width, height }) {
		const style = this.element.style;
		
		style.width = `${width}px`;
		style.height = `${height}px`;

		return this.get();
	}

	destroy() {
		this.setOption('direction', []);
		this.updateHandle();
	}
}

function updateHostRect(host, origin, event, [
	left, top, width, height 
]) {
	const deltaX = event.clientX - origin.pointer.x;
	const deltaY = event.clientY - origin.pointer.y;

	host.style.width = origin.host.size.width + deltaX * width + 'px';
	host.style.height = origin.host.size.height + deltaY * height + 'px';
	host.style.left = origin.host.offset.x + deltaX * left + 'px';
	host.style.top = origin.host.offset.y + deltaY * top + 'px';
}

function encodeHandleIdList([ top, right, bottom, left ] = []) {
	const handleIdList = [];

	if (top) handleIdList.push('top');
	if (right) handleIdList.push('right');
	if (left) handleIdList.push('left');
	if (bottom) handleIdList.push('bottom');
	if (top && left) handleIdList.push('topLeft');
	if (top && right) handleIdList.push('topRight');
	if (bottom && left) handleIdList.push('bottomLeft');
	if (bottom && right) handleIdList.push('bottomRight');
	
	return handleIdList;
}

function ResizeEvent(typeName, host) {
	return new CustomEvent(typeName, {
		bubbles: true,
		cancelable: true,
		detail: {
			width: host.offsetWidth,
			height: host.offsetHeight
		}
	});
}

function handleStyle(handleId) {
	return Object.assign({}, handleBaseStyle, handleStyleMapping[handleId]);
}

function HandleFragment(direction, host) {
	const handleList = encodeHandleIdList(direction);
	const handelElementList = [];

	handleList.forEach(id => {
		const handle = document.createElement('div');

		Object.assign(handle.style, handleStyle(id));
		
		const origin = {
			pointer: { x: 0 , y: 0 },
			host: {
				offset: { x: 0, y: 0 },
				size: { width: 0, height: 0 }
			}
		};

		let resizing = false;

		handle.addEventListener('mousedown', event => {
			if (resizing) {
				return;
			}

			event.stopPropagation();

			origin.pointer = { x: event.clientX, y: event.clientY };
			origin.host.offset = { x: host.offsetLeft, y: host.offsetTop };
			origin.host.size = { width: host.offsetWidth, height: host.offsetHeight };

			document.addEventListener('mousemove', onMousemove);
			document.addEventListener('mouseup', onMouseup);
			resizing = true;
			
			host.dispatchEvent(ResizeEvent('vd-resizestart', host));
		});

		function onMousemove(event) {
			updateHostRect(host, origin, event, handleDeltaMapping[id]);
			host.dispatchEvent(ResizeEvent('vd-resize', host));
		}

		function onMouseup() {
			document.removeEventListener('mousemove', onMousemove);
			document.removeEventListener('mouseup', onMouseup);

			if (resizing) {
				host.dispatchEvent(ResizeEvent('vd-resizeend', host));
			}

			resizing = false;
		}

		handelElementList.push(handle);
	});

	return handelElementList;
}