const DEFAULT_BUFFER_SIZE = 100;

export default function createMask({
	bufferSize = DEFAULT_BUFFER_SIZE
} = {}) {
	const maskElement = document.createElement('div');

	Object.assign(maskElement.style, {
		left: `-${bufferSize}px`,
		top: `-${bufferSize}px`,
		width: '100%',
		height: '100%',
		backgroundColor: 'rgba(0,0,0,0.3)',
		padding: `${bufferSize}px`,
		display: 'none',
		position: 'absolute'
	});

	return maskElement;
}