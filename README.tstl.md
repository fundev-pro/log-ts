# @fundev-pro/log-tstl (Lua version)

Lua version of the logging library, generated from the same TypeScript sources via TypeScriptToLua.

## Installation

Install the Lua package (after publishing) from npm and unpack or use your preferred Lua package manager:

```bash
npm install @fundev-pro/log-tstl
```

The build produces Lua files in the package root:

- `index.lua` – library entry point
- `core/*.lua` – core types and helpers
- `logger/*.lua` – logger implementation
- `targets/*.lua` – console target
- `utils/*.lua` – helper utilities
- `lualib_bundle.lua` – TypeScriptToLua runtime helpers

## Basic Usage (Lua)

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

## Notes

- The Lua version mirrors the API of the JS/TS package `@fundev-pro/log-ts`.
- Timestamps and console output are adapted to Lua (`os.time`, `os.date`, `print`).
- For advanced configuration (targets, rules, filters) follow the JS/TS README (`README.tstjs.md`) – the same concepts apply, only syntax is different.


