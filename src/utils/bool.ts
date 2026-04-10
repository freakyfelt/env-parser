const TRUTHY = ["true", "1", "yes", "y", "on"];
const FALSY = ["false", "0", "no", "n", "off"];

export function isTruthy(value: string): boolean {
	return TRUTHY.includes(value);
}

export function isFalsy(value: string): boolean {
	return FALSY.includes(value);
}
