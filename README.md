# @fundev-pro/log-ts

A TypeScript logging library with flexible configuration and support for multiple output targets.

## Installation

```bash
npm install @fundev-pro/log-ts
```

## Features

- 📊 **6 logging levels**: Trace, Debug, Info, Warn, Error, Fatal
- 🎯 **Flexible target system**: console, files (extensible)
- 🔧 **Configurable**: rules, filters, formatting
- 🎨 **Color highlighting** in browser console
- 📝 **Custom layouts** for message formatting
- 🔍 **Pattern-based filtering** by logger names
- 📦 **TypeScript-first** with full type support

## Quick Start

### Basic Usage

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

### With Configuration

```typescript
import { createLogger, configLog, consoleTarget, LogLevel } from '@fundev-pro/log-ts';

const config = configLog({
    minLevelDefault: LogLevel.Debug,
    maxLevelDefault: LogLevel.Fatal,
    
    targets: {
        console: consoleTarget({
            layout: e => [`[${e.levelName.toUpperCase()}] [${e.logger}]`, ...e.message ]
        })
    },
    
    rules: [
        { pattern: '*', writeTo: 'console' }
    ]
});

const logger = createLogger('MyService', config);
logger.info('Service started');
```

## Usage Examples

### Custom Output Format

```typescript
import { createLogger, configLog, consoleTarget, LogEvent } from '@fundev-pro/log-ts';

const time = (e: LogEvent) => new Date(e.timestamp).toISOString();

const config = configLog({
    targets: {
        console: consoleTarget({
            layout: e => [`${time(e)} [${e.levelName}] ${e.logger}:`, ...e.message]
        })
    },
    rules: [{ pattern: '*', writeTo: 'console' }]
});

const logger = createLogger('App', config);
logger.info('Message with custom format');
```

### Level Filtering

```typescript
import { configLog, consoleTarget, LogLevel } from '@fundev-pro/log-ts';

const config = configLog({
    minLevelDefault: LogLevel.Info,  // Ignore Trace and Debug
    maxLevelDefault: LogLevel.Error, // Ignore Fatal
    
    targets: {
        console: consoleTarget({
            layout: e => [...e.message]
        })
    },
    
    rules: [
        { pattern: '*', writeTo: 'console' }
    ]
});
```

### Logger Name Filtering

```typescript
import { createLogger, configLog, consoleTarget, LogLevel } from '@fundev-pro/log-ts';

const config = configLog({
    targets: {
        console: consoleTarget({
            layout: e => [...e.message]
        })
    },
    
    rules: [
        // Only logs from Database modules
        { pattern: 'Database*', writeTo: 'console' },
        
        // API logs at Warning level and above
        { pattern: 'API*', minLevel: LogLevel.Warn, writeTo: 'console' }
    ]
});

const dbLogger = createLogger('DatabaseService', config);
const apiLogger = createLogger('APIController', config);
```

### Color Highlighting in Browser Console

```typescript
import { createLogger, configLog, consoleTarget, LogLevel } from '@fundev-pro/log-ts';

const config = configLog({
    targets: {
        console: consoleTarget({
            layout: e => [...e.message],
            rowSelectionRules: [
                { predicate: e => e.level === LogLevel.Error, color: 'red' },
                { predicate: e => e.level === LogLevel.Warn, color: 'orange' },
                { predicate: e => e.level === LogLevel.Info, color: 'blue' }
            ]
        })
    },
    rules: [{ pattern: '*', writeTo: 'console' }]
});
```

### Multiple Output Targets

```typescript
import { configLog, consoleTarget, LogLevel, LogEvent } from '@fundev-pro/log-ts';

const time = (e: LogEvent) => new Date(e.timestamp).toISOString();

const config = configLog({
    targets: {
        console: consoleTarget({
            layout: e => [`[${e.levelName}]`, ...e.message]
        }),
        
        detailedConsole: consoleTarget({
            layout: e => [`${time(e)} [${e.levelName}] [${e.logger}]:`, ...e.message]
        })
    },
    
    rules: [
        // Errors to both targets
        { pattern: '*', minLevel: LogLevel.Error, writeTo: ['console', 'detailedConsole'] },
        
        // Everything else to console only
        { pattern: '*', maxLevel: LogLevel.Warn, writeTo: 'console' }
    ]
});
```

## Angular Integration Example

This example shows how to integrate the logger into an Angular application using dependency injection.

### Step 1: Create Log Configuration

**`app/config/log.config.ts`**

```typescript
import { LogEvent, configLog, LogLevel, consoleTarget, padEndByRecent } from '@fundev-pro/log-ts';

const recentLoggers: string[] = [];
const recentLevels: string[] = [];
const level = (e: LogEvent) => padEndByRecent(e.levelName.toLocaleUpperCase(), recentLevels);
const logger = (e: LogEvent) => padEndByRecent(e.logger.replace(/^_/, ''), recentLoggers);
const time = (e: LogEvent) => {
    const date = new Date(e.timestamp);
    return `${date.toTimeString().split(' ')[0]}.${date.getMilliseconds().toString().padStart(3, '0')}`;
};

export const logConfig = configLog({
    minLevelDefault: LogLevel.Trace,
    maxLevelDefault: LogLevel.Error,

    targets: {
        console: consoleTarget({
            layout: e => [`${time(e)}|${level(e)}|${logger(e)}|`, ...e.message],
            rowSelectionRules: [
                { predicate: e => e.level == LogLevel.Trace, color: 'darkgray' },
                { predicate: e => e.level == LogLevel.Debug, color: 'cyan' },
                { predicate: e => e.level == LogLevel.Info, color: 'white' },
                { predicate: e => e.level == LogLevel.Warn, color: 'orange' },
                { predicate: e => e.level == LogLevel.Error, color: 'red' },
            ],
        }),
    },

    rules: [
        { pattern: 'FormComponent', minLevel: LogLevel.Debug, writeTo: 'console', final: true },
        { pattern: 'SignalRService', minLevel: LogLevel.Info, writeTo: 'console', final: true },
        { pattern: 'SelectComponent', minLevel: LogLevel.Trace, writeTo: 'console', final: true },
        { pattern: '*', writeTo: 'console' },
    ],
});
```

### Step 2: Create Injection Token

**`app/config/injection.tokens.ts`**

```typescript
import { InjectionToken } from '@angular/core';
import { logConfig } from './log.config';

export const LOG_CONFIG = new InjectionToken<typeof logConfig>('LOG_CONFIG');
```

### Step 3: Provide Configuration in App Config

**`app/app.config.ts`**

```typescript
import { ApplicationConfig } from '@angular/core';
import { LOG_CONFIG } from './config/injection.tokens';
import { logConfig } from './config/log.config';

export const appConfig: ApplicationConfig = {
    providers: [
        { provide: LOG_CONFIG, useValue: logConfig },
        // ... other providers
    ]
};
```

### Step 4: Create Logger Injection Helper

**`app/utils/inject-logger.ts`**

```typescript
import { Type, inject } from '@angular/core';
import { Logger, createLogger } from '@fundev-pro/log-ts';
import { LOG_CONFIG } from '../config/injection.tokens';

export function injectLogger<T>(logger: Type<T>): Logger {
    const config = inject(LOG_CONFIG);
    return createLogger(logger, config);
}
```

### Step 5: Use in Components/Services

**`app/components/form/form.component.ts`**

```typescript
import { Component, OnInit } from '@angular/core';
import { injectLogger } from '../../utils/inject-logger';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
    private readonly logger = injectLogger(FormComponent);

    ngOnInit() {
        this.logger.info('FormComponent initialized');
    }

    onSubmit(data: unknown) {
        this.logger.info('Form submitted', data);
        // ... implementation
    }

    onError(error: Error) {
        this.logger.error('Form error occurred', error);
        // ... implementation
    }
}
```

**`app/services/signalr.service.ts`**

```typescript
import { Injectable } from '@angular/core';
import { injectLogger } from '../utils/inject-logger';

@Injectable({
    providedIn: 'root'
})
export class SignalRService {
    private readonly logger = injectLogger(SignalRService);

    connect() {
        this.logger.info('Connecting to SignalR hub...');
        // ... implementation
    }

    onMessage(message: unknown) {
        this.logger.debug('Received message', message);
        // ... implementation
    }

    onError(error: Error) {
        this.logger.error('SignalR error', error);
        // ... implementation
    }
}
```

### Benefits of This Approach

- ✅ **Type-safe**: Logger is automatically named after the class
- ✅ **Consistent**: All components use the same configuration
- ✅ **Flexible**: Per-component logging rules in central config
- ✅ **Testable**: Easy to mock in unit tests
- ✅ **DI-friendly**: Follows Angular dependency injection patterns

## Links

- [GitHub Repository](https://github.com/fundev-pro/log-ts)
- [Report Issues](https://github.com/fundev-pro/log-ts/issues)
