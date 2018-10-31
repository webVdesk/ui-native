import createException from './utils/exception';

export default class Controller {
	constructor(element, defaultOptions) {
		this.$element = element;
		this.$options = Object.assign({}, defaultOptions);
	}

	get element() {
		return this.$element;
	}

	$ensureHasOption(name) {
		if (!this.$options.hasOwnProperty(name)) {
			throw createException(`Invalid option item named ${name}.`, 'construction');
		}
	}

	setOption(name, value) {
		this.$ensureHasOption(name);

		return this.$options[name] = value;
	}

	getOption(name) {
		this.$ensureHasOption(name);

		return this.$options[name];
	}

	initOptions(options) {
		for (let name in options) {
			this.setOption(name, options[name]);
		}
	}
}