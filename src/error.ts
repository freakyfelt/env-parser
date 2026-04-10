export class EnvParserError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "EnvParserError";
	}
}

export class ParseError extends EnvParserError {
	constructor(keyName: string, value: string, type: string) {
		super(
			`Invalid environment variable ${keyName}: "${value}" is not a ${type}`,
		);
		this.name = "ParseError";
	}
}

export class MissingError extends EnvParserError {
	constructor(keyName: string) {
		super(`Missing environment variable: "${keyName}"`);
		this.name = "MissingError";
	}
}
