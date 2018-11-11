import Controller from '../controller';
import SelectionAreaController from './selection';

const INJECTION_NAME = '__VD_SELECTABLE__';

export default class SelectableController extends Controller {
	constructor(element) {
		super(element, {});

		element.setAttribute('vd-selectable', '');
		element[INJECTION_NAME] = this;
	}

	static createSelectionAreaElement(element, options = {}) {
		return new SelectionAreaController(element, options);
	}
}