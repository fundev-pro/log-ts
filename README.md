# @fundev-pro/log

Single codebase, two packages:

- JS/TS: `@fundev-pro/log-ts`
- TSTL/Lua: `@fundev-pro/log-tstl`

## Installation

```bash
# JS / TS
npm install @fundev-pro/log-ts

# TSTL / Lua
npm install @fundev-pro/log-tstl
```

## Quick start (JS/TS)

```typescript
import { createLogger } from '@fundev-pro/log-ts';

const logger = createLogger('MyApp');
logger.info('Hello from JS/TS');
```

## Quick start (TSTL)

```typescript
import { createLogger } from '@fundev-pro/log-tstl';

const logger = createLogger('MyApp');
logger.info('Hello from TSTL');
```

## Quick start (Lua)

```lua
local log = require("index") -- path depends on how you load the package
local createLogger = log.createLogger

local logger = createLogger("MyApp")
logger:info("Hello from Lua")
```

## Configuration examples

### Basic configuration

```typescript
import { createLogger, configLog, LogLevel } from '@fundev-pro/log-ts'; // or '@fundev-pro/log-tstl'
import { consoleTarget } from '@fundev-pro/log-ts/console'; // for JS/TS

const config = configLog({
    minLevelDefault: LogLevel.Debug,
    maxLevelDefault: LogLevel.Fatal,

    targets: {
        console: consoleTarget({
            layout: e => [`[${e.levelName.toUpperCase()}] [${e.logger}]`, ...e.message],
        }),
    },

    timestampProvider: () => Date.now(), // or () => os.time() for Lua

    rules: [{ pattern: '*', writeTo: 'console' }],
});

const logger = createLogger('MyService', config);
logger.info('Service started');
```

### Custom output format

```typescript
import { createLogger, configLog, consoleTarget, LogEvent, LogLevel } from '@fundev-pro/log-ts';

const time = (e: LogEvent) => new Date(e.timestamp).toISOString();

const config = configLog({
    minLevelDefault: LogLevel.Debug,
    maxLevelDefault: LogLevel.Error,

    targets: {
        console: consoleTarget({
            layout: e => [`${time(e)} [${e.levelName}] ${e.logger}:`, ...e.message],
        }),
    },

    timestampProvider: () => Date.now(),

    rules: [{ pattern: '*', writeTo: 'console' }],
});

const logger = createLogger('App', config);
logger.info('Message with custom format');
```

### Level & logger-name filtering

```typescript
import { createLogger, configLog, consoleTarget, LogLevel } from '@fundev-pro/log-ts';

const config = configLog({
    minLevelDefault: LogLevel.Info,
    maxLevelDefault: LogLevel.Error,

    targets: {
        console: consoleTarget({
            layout: e => [...e.message],
        }),
    },

    timestampProvider: () => Date.now(),

    rules: [
        { pattern: 'Database*', writeTo: 'console' },
        { pattern: 'API*', minLevel: LogLevel.Warn, writeTo: 'console' },
    ],
});

const dbLogger = createLogger('DatabaseService', config);
const apiLogger = createLogger('APIController', config);
```

### Browser console colors

```typescript
import { createLogger, configLog, consoleTarget, LogLevel } from '@fundev-pro/log-ts';

const config = configLog({
    minLevelDefault: LogLevel.Trace,
    maxLevelDefault: LogLevel.Error,

    targets: {
        console: consoleTarget({
            layout: e => [...e.message],
            rowSelectionRules: [
                { predicate: e => e.level === LogLevel.Error, color: 'red' },
                { predicate: e => e.level === LogLevel.Warn, color: 'orange' },
                { predicate: e => e.level === LogLevel.Info, color: 'blue' },
            ],
        }),
    },

    timestampProvider: () => Date.now(),

    rules: [{ pattern: '*', writeTo: 'console' }],
});

const logger = createLogger('BrowserApp', config);
logger.error('Colored error message');
```

### Multiple output targets

```typescript
import { configLog, consoleTarget, LogLevel, LogEvent, createLogger } from '@fundev-pro/log-ts';

const time = (e: LogEvent) => new Date(e.timestamp).toISOString();

const config = configLog({
    minLevelDefault: LogLevel.Trace,
    maxLevelDefault: LogLevel.Error,

    targets: {
        console: consoleTarget({
            layout: e => [`[${e.levelName}]`, ...e.message],
        }),
        detailedConsole: consoleTarget({
            layout: e => [`${time(e)} [${e.levelName}] [${e.logger}]:`, ...e.message],
        }),
    },

    timestampProvider: () => Date.now(),

    rules: [
        { pattern: '*', minLevel: LogLevel.Error, writeTo: ['console', 'detailedConsole'] },
        { pattern: '*', maxLevel: LogLevel.Warn, writeTo: 'console' },
    ],
});

const logger = createLogger('MultiTargetApp', config);
logger.error('Goes to both targets');
```

## Platform-specific docs

- **JS/TS**: see `README.tstjs.md` for platform-specific examples and built-in presets
- **TSTL/Lua**: see `README.tstl.md` for Lua-specific usage and `print` target
