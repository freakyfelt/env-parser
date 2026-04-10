import assert from "node:assert";
import { describe, it } from "node:test";
import { isFalsy, isTruthy } from "./bool.ts";

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
