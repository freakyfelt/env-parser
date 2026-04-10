import assert from "node:assert";
import { before, describe, it } from "node:test";
import { ParseError } from "./error.ts";
import { UnsafeEnvParser } from "./unsafe.ts";

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

		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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

		it("throws ParseError if the environment variable is not a boolean", () => {
			assert.throws(() => parser.bool("PORT"), ParseError);
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

		it("throws ParseError if the environment variable is a boolean", () => {
			assert.throws(() => parser.int("DEBUG"), ParseError);
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

		it("throws ParseError if the environment variable is a boolean", () => {
			assert.throws(() => parser.float("DEBUG"), ParseError);
		});

		it("returns the expected float if the environment variable is an integer", () => {
			assert.equal(parser.float("PORT"), 8080);
		});

		it("throws ParseError if the environment variable is not a number", () => {
			assert.throws(() => parser.float("LOG_LEVEL"), ParseError);
		});
	});
});
