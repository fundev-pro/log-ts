# @fundev-pro/log-tstl (TSTL / Lua version)

TSTL / Lua version of the logging library, generated from the same TypeScript sources via TypeScriptToLua.

> **For general configuration examples**, see the main [README.md](README.md).  
> This document covers **TSTL/Lua-specific** features and the `print` target.

## Installation

Install the Lua package (after publishing) from npm and unpack or use your preferred Lua package manager:

```bash
npm install @fundev-pro/log-tstl
```

The build produces Lua files in the package root:

- `index.lua` – library entry point
- `internal/*` – core types, logger, targets, utils
- `print/*` – print target and preset config

## Basic usage (Lua)

```lua
local log = require("index")  -- or your own module path

local createLogger = log.createLogger

local logger = createLogger("MyApp")

logger:trace("Trace message")
logger:debug("Debug message")
logger:info("Info message")
logger:warn("Warning message")
logger:error("Error message")
logger:fatal("Fatal error")
```

> **Note**: When you call `createLogger` without a config, it automatically uses `printLogConfig()` as the default.

## Configuration from TypeScript

All configuration examples are written in TypeScript and compiled to Lua.
You write your logging setup in TS using `@fundev-pro/log-tstl` (TSTL target), and TypeScriptToLua produces the Lua version with the **same public API**.

### Customizing the built-in `print` preset

If you want to modify the default print configuration:

```typescript
import { createLogger, LogLevel } from '@fundev-pro/log-tstl';
import { printLogConfig } from '@fundev-pro/log-tstl/print';

const customConfig = printLogConfig();
customConfig.rules = [
    { pattern: 'MyApp', minLevel: LogLevel.Warn, writeTo: 'print' }
];

export const logger = createLogger('MyLuaApp', customConfig);
```

### What's included in `printLogConfig`

- **Timestamp**: formatted via `os.date('%Y-%m-%d %H:%M:%S', e.timestamp)`
- **Log level**: padded dynamically (e.g., `TRACE`, `DEBUG`, `INFO`)
- **Logger name**: padded dynamically
- **Layout**: `timestamp|level|logger| ...messages` (joined as string)
- **Print function**: uses Lua's `print(...)`

### Example: custom Lua configuration

```typescript
import { createLogger, configLog, LogLevel } from '@fundev-pro/log-tstl';
import { printTarget } from '@fundev-pro/log-tstl/print';

const config = configLog({
    minLevelDefault: LogLevel.Debug,
    maxLevelDefault: LogLevel.Error,

    targets: {
        print: printTarget({
            layout: e => [`[${e.levelName}]`, ...e.message]
        }),
    },

    timestampProvider: () => os.time(),

    rules: [{ pattern: '*', writeTo: 'print' }],
});

export const logger = createLogger('MyLuaApp', config);
```

## Notes

- The Lua version mirrors the API of the JS/TS package `@fundev-pro/log-ts`.
- Timestamps and console output are adapted to Lua (`os.time`, `os.date`, `print`).
- For more configuration patterns (filtering, multiple targets, etc.), see the main [README.md](README.md) – the same concepts apply, you just write them in TypeScript.


