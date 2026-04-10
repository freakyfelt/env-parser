import assert from "node:assert";
import { beforeEach, describe, it } from "node:test";
import process from "node:process";
import { MissingError } from "./error.ts";
import { EnvParser } from "./parser.ts";

interface ExampleEnv {
	PORT: number;
	HOST: string;
	DEBUG: boolean;
	LOG_LEVEL: "debug" | "info" | "warn" | "error";
	SAMPLE_RATE: number;
}

describe("EnvParser", () => {
	let parser: EnvParser<keyof ExampleEnv>;
	let emptyParser: EnvParser<keyof ExampleEnv>;

	beforeEach(() => {
		parser = new EnvParser({
			PORT: "8080",
			HOST: "localhost",
			DEBUG: "true",
			LOG_LEVEL: "debug",
			SAMPLE_RATE: "0.5",
		});

		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		emptyParser = new EnvParser({} as any);
	});

	describe("fromProcessEnv", () => {
		it("populates from process.env", () => {
			process.env.MY_TEST_VAR = "from-process";
			assert.equal(process.env.MY_TEST_VAR, "from-process");

			assert.equal(
				EnvParser.fromProcessEnv<"MY_TEST_VAR">().str("MY_TEST_VAR"),
				"from-process",
			);
		});
	});

	describe("str", () => {
		it("returns the value of the environment variable", () => {
			assert.equal(parser.str("HOST"), "localhost");
		});

		it("throws MissingError if the environment variable is not set", () => {
			assert.throws(() => emptyParser.str("HOST"), MissingError);
		});

		it("uses the default value provided", () => {
			assert.equal(parser.str("HOST", "default"), "localhost");
			assert.equal(emptyParser.str("HOST", "default"), "default");
		});

		it("fails to compile if the environment variable is not in the type", () => {
			// @ts-expect-error no such variable
			assert.throws(() => parser.str("MISSING"));
		});

		it("returns undefined when using the unsafe parser", () => {
			assert.strictEqual(emptyParser.unsafe.str("HOST"), undefined);
		});
	});

	describe("bool", () => {
		it("returns the value of the environment variable", () => {
			assert.equal(parser.bool("DEBUG"), true);
		});

		it("throws MissingError if the environment variable is not set", () => {
			assert.throws(() => emptyParser.bool("DEBUG"), MissingError);
		});

		it("uses the default value provided", () => {
			assert.equal(parser.bool("DEBUG", false), true);
			assert.equal(emptyParser.bool("DEBUG", false), false);
		});

		it("fails to compile if the environment variable is not in the type", () => {
			// @ts-expect-error no such variable
			assert.throws(() => parser.bool("MISSING"));
		});

		it("returns undefined when using the unsafe parser", () => {
			assert.strictEqual(emptyParser.unsafe.bool("DEBUG"), undefined);
		});

		it("throws if the environment variable is not a boolean", () => {
			assert.throws(() => parser.bool("PORT"));
		});
	});

	describe("int", () => {
		it("returns the value of the environment variable", () => {
			assert.equal(parser.int("PORT"), 8080);
		});

		it("throws MissingError if the environment variable is not set", () => {
			assert.throws(() => emptyParser.int("PORT"), MissingError);
		});

		it("uses the default value provided", () => {
			assert.equal(parser.int("PORT", 80), 8080);
			assert.equal(emptyParser.int("PORT", 80), 80);
		});

		it("fails to compile if the environment variable is not in the type", () => {
			// @ts-expect-error no such variable
			assert.throws(() => parser.int("MISSING"));
		});

		it("returns undefined when using the unsafe parser", () => {
			assert.strictEqual(emptyParser.unsafe.int("PORT"), undefined);
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

		it("throws MissingError if the environment variable is not set", () => {
			assert.throws(() => emptyParser.float("SAMPLE_RATE"), MissingError);
		});

		it("uses the default value provided", () => {
			assert.equal(parser.float("SAMPLE_RATE", 0.1), 0.5);
			assert.equal(emptyParser.float("SAMPLE_RATE", 0.1), 0.1);
		});

		it("fails to compile if the environment variable is not in the type", () => {
			// @ts-expect-error no such variable
			assert.throws(() => parser.float("MISSING"));
		});

		it("returns undefined when using the unsafe parser", () => {
			assert.strictEqual(emptyParser.unsafe.float("SAMPLE_RATE"), undefined);
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
