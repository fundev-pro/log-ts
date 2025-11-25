# @fundev-pro/log-ts (JS/TS version)

TypeScript/JavaScript logging library with flexible configuration and multiple output targets.

> **For general configuration examples**, see the main [README.md](README.md).  
> This document covers **JS/TS-specific** features and built-in presets.

## Installation

```bash
npm install @fundev-pro/log-ts
```

## Quick Start

```typescript
import { createLogger } from '@fundev-pro/log-ts';

const logger = createLogger('MyApp');

logger.trace('Trace message');
logger.debug('Debug message');
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message');
logger.fatal('Fatal error');
```

> **Note**: When you call `createLogger` without a config, it automatically uses `consoleLogConfig()` as the default.

## Customizing the built-in console preset

If you want to modify the default console configuration (e.g., change rules or levels):

```typescript
import { createLogger, LogLevel } from '@fundev-pro/log-ts';
import { consoleLogConfig } from '@fundev-pro/log-ts/console';

// Customize the preset
const customConfig = consoleLogConfig();
customConfig.rules = [{ pattern: 'MyApp', minLevel: LogLevel.Warn, writeTo: 'console' }];
const logger = createLogger('MyApp', customConfig);
```

### What's included in `consoleLogConfig`

- **Timestamp**: formatted as `HH:MM:SS.mmm`
- **Log level**: padded dynamically (e.g., `TRACE`, `DEBUG`, `INFO`)
- **Logger name**: padded dynamically
- **Color rules** for browser console:
    - `Trace` → darkgray
    - `Debug` → cyan
    - `Info` → white
    - `Warn` → orange
    - `Error` → red
- **Layout**: `timestamp|level|logger| ...messages`

## Platform-specific features

### `consoleTarget` from `@fundev-pro/log-ts/console`

```typescript
import { consoleTarget } from '@fundev-pro/log-ts/console';
import { configLog, LogLevel } from '@fundev-pro/log-ts';

const config = configLog({
    minLevelDefault: LogLevel.Debug,
    maxLevelDefault: LogLevel.Error,

    targets: {
        console: consoleTarget({
            layout: e => [`[${e.levelName}]`, ...e.message],
        }),
    },

    timestampProvider: () => Date.now(),

    rules: [{ pattern: '*', writeTo: 'console' }],
});
```

### Angular integration (concept)

You can integrate the logger into Angular:

- create a shared `logConfig` with `configLog`
- provide it via DI
- create helper `injectLogger` that calls `createLogger` with config
