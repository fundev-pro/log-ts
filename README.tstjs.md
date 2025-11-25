# @fundev-pro/log-ts (JS/TS version)

TypeScript/JavaScript logging library with flexible configuration and multiple output targets.

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

## With Configuration

```typescript
import { createLogger, configLog, consoleTarget, LogLevel } from '@fundev-pro/log-ts';

const config = configLog({
    minLevelDefault: LogLevel.Debug,
    maxLevelDefault: LogLevel.Fatal,

    targets: {
        console: consoleTarget({
            layout: e => [`[${e.levelName.toUpperCase()}] [${e.logger}]`, ...e.message],
        }),
    },

    rules: [{ pattern: '*', writeTo: 'console' }],
});

const logger = createLogger('MyService', config);
logger.info('Service started');
```

## More Examples

- Custom output format
- Level and logger-name filtering
- Color highlighting in browser console
- Multiple output targets
- Angular integration

All detailed examples are the same as in the original README of this repository and work with the JS/TS package `@fundev-pro/log-ts`.


