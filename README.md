# @freakyfelt/env-parser

Provides yet another environment variable parser that aims to be dependency free, concise, type safe, and easy to use. It does not seek to automate constructing entire configuration objects, rather it provides a common utility for interpreting environment variables that can then be used in your configuration.

> [!TIP] Having your environment variables defined as an interface also has the benefit of self documenting what the expected environment variables are.

## Getting started

> [!TIP] This package has an engines.node requirement of `>=22.0.0` but should work fine with older versions of node.

To get started, first define what your environment variables should look like in a type object.

```ts
interface AppEnv {
  HOST: string;
  PORT: number;
  DEBUG: boolean;
  LOG_LEVEL: LogLevel;
  SAMPLE_RATE: number;
}
```

Then create an `EnvParser` instance and use the provided methods.

### Using process.env directly

Use `fromProcessEnv` when you want to initialize from Node's `process.env` without manually casting.

```ts
import { EnvParser } from "@freakyfelt/env-parser";

const processEnv = EnvParser.fromProcessEnv<keyof AppEnv>();

const config: AppConfig = {
  server: {
    // use a default "0.0.0.0" if HOST is not set
    host: processEnv.str("HOST", "0.0.0.0"),

    // parse the integer value of PORT or use 3000 if not set
    // throws ParseError if PORT is not an integer
    port: processEnv.int("PORT", 3000),

    // coerces from a truthy/false string or throw a ParseError
    // truthy values: "true", "1", "yes", "y", "on"
    // falsy values: "false", "0", "no", "n", "off"
    debug: processEnv.unsafe.bool("DEBUG")
  },
  logger: {
    // constrain the return value to one of a LogLevel type
    // WARNING: This is still only a compile-time only check and does not validate the value at runtime
    level: processEnv.str<LogLevel>("LOG_LEVEL", LogLevel.info)
  },
  tracing: {
    // parse the float value of SAMPLE_RATE or use undefined if not set
    // throws ParseError if SAMPLE_RATE does not pass isNaN()
    sampleRate: processEnv.unsafe.float("SAMPLE_RATE")
  }
};
```

### Using custom env objects

`EnvParser` is runtime-agnostic and works with any object shaped like `Record<string, string | undefined>`, so you can pass values from test fixtures or custom runtime sources.

```ts
const parser = new EnvParser<keyof AppEnv>({
  HOST: "localhost",
  PORT: "3000",
  DEBUG: "false",
  LOG_LEVEL: "info",
  SAMPLE_RATE: "0.5"
});
```

### Handling errors

The parser will throw an error if the value is not of the expected type

```sh
> processEnv.int('PWD')
Uncaught ParseError: Invalid environment variable HOST: "localhost" is not an integer
> processEnv.float('SAMPLE_RATE')
Uncaught MissingError: Missing environment variable: "SAMPLE_RATE"
```

Additionally, TypeScript will fail to compile if a variable name that was not declared is requested

### Accessing potentially missing values

The default env parser will throw an error if the resulting value is `undefined`. This can be overridden by using the `unsafe` field on the parser.

```sh
> const sampleRate = processEnv.unsafe.float('SAMPLE_RATE')
undefined
```

### Specifying a default value

You can also specify a default value to use if the variable is missing

```sh
> const sampleRate = processEnv.float('SAMPLE_RATE', 0.1);
0.1
```

## Changelog

The changelog can be found on the [Releases page](https://github.com/freakyfelt/env-parser/releases).

## Contributing

Everyone is welcome to contribute. Please take a moment to review the [contributing guidelines](CONTRIBUTING.md).

## Authors and license

[Bruce Felt](https://github.com/freakyfelt/env-parser) and [contributors](https://github.com/freakyfelt/env-parser/graphs/contributors).

MIT License, see the included [LICENSE.md](License.md) file.
