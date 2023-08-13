import process from "node:process";
import { UnsafeEnvParser } from "./unsafe";

/**
 * A safe environment variable parser.
 *
 * @example
 * const env = new EnvParser({
 *   PORT: "8080",
 *   ENABLED: "true",
 *   DISABLED: "false",
 *   PI: "3.14",
 *   MISSING: undefined,
 * });
 *
 * 	env.str("PORT"); // => "8080"
 * 	env.int("PORT"); // => 8080
 * 	env.bool("ENABLED"); // => true
 * 	env.bool("DISABLED"); // => false
 * 	env.float("PI"); // => 3.14
 * 	env.str("MISSING"); // => Error: Missing environment variable: MISSING
 *
 *  // use the unsafe parser to safely handle undefined variables
 *  env.unsafe.str("MISSING"); // => undefined
 */
export class EnvParser<TEnv extends string> {
	public readonly unsafe: UnsafeEnvParser<TEnv>;

	constructor(
		env: Record<TEnv, string | undefined> = process.env as Record<TEnv, string>,
	) {
		this.unsafe = new UnsafeEnvParser(env);
	}

	str<T extends string = string>(name: TEnv, def?: string): T {
		const value = this.unsafe.str(name) ?? def;

		if (value === undefined) {
			throw new Error(`Missing environment variable: ${String(name)}`);
		}

		return value as T;
	}

	/**
	 * Parse a boolean environment variable.
	 *
	 * @see {@link UnsafeEnvParser.bool}
	 */
	bool(name: TEnv, def?: boolean): boolean {
		const value = this.unsafe.bool(name) ?? def;

		if (value === undefined) {
			throw new Error(`Missing environment variable: ${String(name)}`);
		}

		return value;
	}

	/**
	 * Parse an integer environment variable.
	 *
	 * @see {@link UnsafeEnvParser.int}
	 */
	int(name: TEnv, def?: number): number {
		const value = this.unsafe.int(name) ?? def;

		if (value === undefined) {
			throw new Error(`Missing environment variable: ${String(name)}`);
		}

		return value;
	}

	/**
	 * Parse a floating point environment variable.
	 *
	 * @see {@link UnsafeEnvParser.float}
	 */
	float(name: TEnv, def?: number): number {
		const value = this.unsafe.float(name) ?? def;

		if (value === undefined) {
			throw new Error(`Missing environment variable: ${String(name)}`);
		}

		return value;
	}
}
