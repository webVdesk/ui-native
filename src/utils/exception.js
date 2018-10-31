class NativeUIException extends Error {}
class NativeUIRuntimeException extends NativeUIException {}
class NativeUIConstructionException extends NativeUIException {}

const mapping = {
	default: NativeUIException,
	runtime: NativeUIRuntimeException,
	construction: NativeUIConstructionException
};

export default function createException(message, type = 'default') {
	return new mapping[type](message);
}