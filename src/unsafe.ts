const TRUTHY = ["true", "1", "yes", "y", "on"];
const FALSY = ["false", "0", "no", "n", "off"];

export function isTruthy(value: string): boolean {
	return TRUTHY.includes(value);
}

export function isFalsy(value: string): boolean {
	return FALSY.includes(value);
}

/**
 * A parser for environment variables that attempts to parse the string
 * into the desired type. If the value is not present, `undefined` is returned.
 *
 * @example
 * const env = new UnsafeEnvParser({
 *  PORT: "8080",
 *  ENABLED: "true",
 *  DISABLED: "false",
 *  PI: "3.14",
 *  MISSING: undefined,
 * });
 *
 * env.str("PORT"); // => "8080"
 * env.int("PORT"); // => 8080
 * env.bool("ENABLED"); // => true
 * env.bool("DISABLED"); // => false
 * env.float("PI"); // => 3.14
 * env.str("MISSING"); // => undefined
 */
export class UnsafeEnvParser<TEnv extends string> {
	private readonly env: Record<TEnv, string | undefined>;

	constructor(env: Record<TEnv, string | undefined>) {
		// process.env has a performance hit each time it is accessed
		// so we use a local copy of the environment variables
		this.env = { ...env };
	}

	/**
	 * Parse and trim a string environment variable if present.
	 */
	str<T extends string = string>(name: TEnv): T | undefined {
		return this.env[name] as T | undefined;
	}

	/**
	 * Parse a boolean environment variable if present.
	 *
	 * The following values are considered truthy:
	 *
	 * `true`, `1`, `yes`, `y`, `on`
	 *
	 * The following values are considered falsy:
	 *
	 * `false`, `0`, `no`, `n`, `off`
	 */
	bool(name: TEnv): boolean | undefined {
		const value = this.str(name);

		if (value === undefined) {
			return;
		}

		if (isTruthy(value)) {
			return true;
		} else if (isFalsy(value)) {
			return false;
		} else {
			throw new Error(
				`Invalid environment variable ${String(
					name
				)}: "${value}" is not a boolean`
			);
		}
	}

	/**
	 * Parse an integer environment variable if present.
	 *
	 * WARNING: Floating point numbers will be parsed as integers
	 */
	int(name: TEnv): number | undefined {
		const value = this.str(name);

		if (value === undefined) {
			return;
		}

		const parsed = parseInt(value, 10);

		if (isNaN(parsed)) {
			throw new Error(
				`Invalid environment variable ${String(
					name
				)}: "${value}" is not an integer`
			);
		}

		return parsed;
	}

	/**
	 * Parse a floating point environment variable if present.
	 */
	float(name: TEnv): number | undefined {
		const value = this.env[name];

		if (value === undefined) {
			return;
		}

		const parsed = parseFloat(value);

		if (isNaN(parsed)) {
			throw new Error(
				`Invalid environment variable ${String(
					name
				)}: "${value}" is not a number`
			);
		}

		return parsed;
	}
}
