# @freakyfelt/env-parser

Provides yet another environment variable parser that aims to be dependency free, concise, type safe, and easy to use. It does not seek to automate constructing entire configuration objects, rather it provides a common utility for interpreting environment variables that can then be used in your configuration.

TIP: Having your environment variables defined as an interface also has the benefit of self documenting what the expected environment variables are.

## Getting started

To get started, first define what your environment variables should look like in a type object

```ts
interface AppEnv {
  HOST: string;
  PORT: number;
  DEBUG: boolean;
  LOG_LEVEL: LogLevel;
  SAMPLE_RATE: number;
}
```

Once you have the expected variables defined pass the list of keys to a new instance of the env parser and then use the provided methods

```ts
import { EnvParser } from "@freakyfelt/env-parser";

const processEnv = new EnvParser<keyof AppEnv>();

const config: AppConfig = {
  server: {
    host: processEnv.str("HOST", "0.0.0.0"),
    port: processEnv.int("PORT", 3000),
    debug: processEnv.unsafe.bool("DEBUG")
  },
  logger: {
    level: processEnv.str<LogLevel>("LOG_LEVEL", LogLevel.info)
  },
  tracing: {
    sampleRate: processEnv.unsafe.float("SAMPLE_RATE")
  }
};
```

The parser will throw an error if the variable is not present or the value is invalid for the type requested.

```sh
> processEnv.int('HOST')
Error(Invalid environment variable HOST: "localhost" is not an integer)
> processEnv.float('SAMPLE_RATE')
Error(Missing environment variable: "SAMPLE_RATE")
```

Additionally, the parser will fail to compile if a variable name that was not declared is requested

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
