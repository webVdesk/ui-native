import _ from 'lodash';

import Controller from '../controller';
import createMask from './mask';
import * as handle from './handle';
import * as page from './page';
import {
	ensureHandleIsElement,
	VdDragEvent,
	DefaultOptions,
	getElementFromPoint,
	getPointerClientPosition,
	getElementOffsetPosition,
	constraintFilter,
	computeElementOffset,
} from './helper';

const STATE = { IDLE: -1, READY: 0, MOVING: 1 };
let dragover = document;

export default class DraggableController extends Controller {
	constructor(element, options) {
		super(element, DefaultOptions());
		this.initOptions(options);

		this.position = {
			pointer: {
				origin: { x: 0, y: 0 },
				present: { x: 0, y: 0 }
			},
			element: {
				origin: { x: 0, y: 0 }
			},
			parentScroll: {
				origin: { x: 0, y: 0 }
			}
		};
		
		this.$timer = null;
		this.$state = STATE.IDLE;
		this.$dataFactory = this.getOption('dataFactory');
		this.$mask = createMask();

		element.appendChild(this.$mask);

		this.$onMousedown = event => {
			if (this.$state !== STATE.IDLE) {
				return this.$cancel();
			}
			
			page.disableDefaultBehavior();

			if (this.getOption('handled') && !event.__VD_HANDLE_EVENT__) {
				return;
			}
			
			this.$state = STATE.READY;

			const startMoving = () => {
				const threshold = this.getOption('threshold');

				if (threshold !== 0) {
					return;
					//TODO
				}

				this.$state = STATE.MOVING;
				this.$start(event);

			};

			const delay = this.getOption('delay');

			if (delay === 0) {
				startMoving();
			} else {
				this.$timer = setTimeout(startMoving, delay);
			}
		};

		this.$onMousemove = event => {
			event.stopPropagation();

			this.$move(event);
		};

		this.$onMouseup = event => {
			if (this.$state === STATE.MOVING) {
				this.$end(event);
			}

			this.$cancel();
		};
		
		this.element.addEventListener('mousedown', this.$onMousedown);
		this.element.addEventListener('mouseup', this.$onMouseup);
	}

	get $offsetParent() {
		return this.element.offsetParent;
	}

	$dispatch(typeName, element, mouseEvent) {
		const dragEvent = VdDragEvent(
			typeName,
			this.$dataFactory(this),
			mouseEvent,
			element
		);

		element.dispatchEvent(dragEvent);
	}

	$updateDragoverElement(event) {
		const newDragover = getElementFromPoint(
			this.position.pointer.present,
			this.element
		) || document;

		if (newDragover === dragover) {
			this.$dispatch('vd-dragover', dragover, event);
		} else {
			this.$dispatch('vd-dragleave', dragover, event);
			this.$dispatch('vd-dragenter', newDragover, event);

			dragover = newDragover;
		}
	}

	$start(event) {
		const { pointer, element } = this.position;

		element.origin = getElementOffsetPosition(this.element);
		pointer.origin = getPointerClientPosition(event);
		this.$mask.style.display = 'block';

		this.element.addEventListener('mousemove', this.$onMousemove);
		document.addEventListener('mousemove', this.$onMousemove);
		document.addEventListener('mouseup', this.$onMouseup);

		this.$dispatch('vd-dragstart', this.element, event);
	}

	$move(event) {
		this.$setOffsetFromEvent(event);

		if (this.getOption('droppable')) {
			this.$updateDragoverElement(event);
		}

		this.$dispatch('vd-drag', this.element, event);
	}

	$end(event) {
		page.enableDefaultBehavior();
		this.$setOffsetFromEvent(event);
		this.$mask.style.display = 'none';

		this.$dispatch('vd-dragend', this.element, event);

		if (this.getOption('droppable')) {
			this.$dispatch('vd-drop', dragover, event);
		}

		dragover = document;
	}

	$cancel() {
		clearTimeout(this.$timer);
		this.$timer = null;
		
		this.element.removeEventListener('mousemove', this.$onMousemove);
		document.removeEventListener('mousemove', this.$onMousemove);
		document.removeEventListener('mouseup', this.$onMouseup);
		
		this.$state = STATE.IDLE;
	}

	get() {
		const { offsetTop, offsetLeft } = this.element;

		return { x: offsetLeft, y: offsetTop };
	}

	set({ x, y }) {
		const style = this.element.style;
		
		if (this.getOption('axis') !== 'y') {
			style.left = `${x}px`;
		}

		if (this.getOption('axis') !== 'x') {
			style.top = `${y}px`;
		}

		return this.get();
	}

	$setOffsetFromEvent(event) {
		let offset;

		const originOffset = offset = computeElementOffset({
			pointerOrigin: this.position.pointer.origin,
			pointerPresent: this.position.pointer.present = getPointerClientPosition(event),
			elementOrigin: this.position.element.origin
		});

		if (this.getOption('constraint')) {
			offset = constraintFilter({
				originOffset,
				parentElement: this.$offsetParent,
				element: this.element
			});
		}

		return this.set(offset);
	}

	destroy() {
		this.$cancel();
		this.element.removeEventListener('mousedown', this.$onMousedown);
		this.element.removeEventListener('mouseup', this.$onMouseup);
	}

	static createHandle(element) {
		ensureHandleIsElement(element);

		if (element.__VD_HANDLE__ === true) {
			return false;
		}

		handle.create(element);

		return true;
	}

	static destroyHandle(element) {
		ensureHandleIsElement(element);

		if (_.isUndefined(element.__VD_HANDLE__)) {
			return false;
		}

		handle.destroy(element);

		return true;
	}
}
