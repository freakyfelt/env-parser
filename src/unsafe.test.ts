import assert from "node:assert";
import { before, describe, it } from "node:test";
import { UnsafeEnvParser, isFalsy, isTruthy } from "./unsafe.ts";

const TRUTHY = ["true", "1", "yes", "on"];
describe("isTruthy", () => {
	for (const value of TRUTHY) {
		it(`returns true for ${value}`, () => {
			assert.equal(isTruthy(value), true);
		});
	}

	it("returns false for other values", () => {
		assert.equal(isTruthy("hello"), false);
	});
});

const FALSY = ["false", "0", "no", "off"];
describe("isFalsy", () => {
	for (const value of FALSY) {
		it(`returns true for ${value}`, () => {
			assert.equal(isFalsy(value), true);
		});
	}

	it("returns false for other values", () => {
		assert.equal(isFalsy("hello"), false);
	});
});

interface ExampleEnv {
	PORT: number;
	HOST: string;
	DEBUG: boolean;
	LOG_LEVEL: "debug" | "info" | "warn" | "error";
	SAMPLE_RATE: number;
}

describe("UnsafeEnvParser", () => {
	let parser: UnsafeEnvParser<keyof ExampleEnv>;
	let emptyParser: UnsafeEnvParser<keyof ExampleEnv>;

	before(() => {
		parser = new UnsafeEnvParser({
			PORT: "8080",
			HOST: "localhost",
			DEBUG: "true",
			LOG_LEVEL: "debug",
			SAMPLE_RATE: "0.5",
		});

		emptyParser = new UnsafeEnvParser({} as any);
	});

	describe("str", () => {
		it("returns the value of the environment variable", () => {
			assert.equal(parser.str("HOST"), "localhost");
		});

		it("returns undefined if the environment variable is not set", () => {
			assert.strictEqual(emptyParser.str("HOST"), undefined);
		});

		it("fails to compile if the environment variable is not in the type", () => {
			// @ts-expect-error no such variable
			assert.strictEqual(parser.str("MISSING"), undefined);
		});
	});

	describe("bool", () => {
		it("returns the boolean parsed from the environment variable", () => {
			assert.equal(parser.bool("DEBUG"), true);
		});

		it("returns undefined if the environment variable is not set", () => {
			assert.strictEqual(emptyParser.bool("DEBUG"), undefined);
		});

		it("fails to compile if the environment variable is not in the type", () => {
			// @ts-expect-error no such variable
			assert.strictEqual(parser.bool("MISSING"), undefined);
		});

		it("throws if the environment variable is not a boolean", () => {
			assert.throws(() => parser.bool("PORT"));
		});
	});

	describe("int", () => {
		it("returns the value of the environment variable", () => {
			assert.equal(parser.int("PORT"), 8080);
		});

		it("returns undefined if the environment variable is not set", () => {
			assert.strictEqual(emptyParser.int("PORT"), undefined);
		});

		it("fails to compile if the environment variable is not in the type", () => {
			// @ts-expect-error no such variable
			assert.strictEqual(parser.int("MISSING"), undefined);
		});

		it("throws if the environment variable is a boolean", () => {
			assert.throws(() => parser.int("DEBUG"));
		});

		it("returns the expected integer if the environment variable is a float", () => {
			assert.strictEqual(parser.int("SAMPLE_RATE"), 0);
		});
	});

	describe("float", () => {
		it("returns the value of the environment variable", () => {
			assert.equal(parser.float("SAMPLE_RATE"), 0.5);
		});

		it("returns undefined if the environment variable is not set", () => {
			assert.strictEqual(emptyParser.float("SAMPLE_RATE"), undefined);
		});

		it("fails to compile if the environment variable is not in the type", () => {
			// @ts-expect-error no such variable
			assert.strictEqual(parser.float("MISSING"), undefined);
		});

		it("throws if the environment variable is a boolean", () => {
			assert.throws(() => parser.float("DEBUG"));
		});

		it("returns the expected float if the environment variable is an integer", () => {
			assert.equal(parser.float("PORT"), 8080);
		});

		it("throws if the environment variable is not a number", () => {
			assert.throws(() => parser.float("LOG_LEVEL"));
		});
	});
});
