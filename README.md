# @fundev-pro/log

Логгер с одной кодовой базой и двумя пакетами:

- JS/TS: `@fundev-pro/log-ts`
- Lua: `@fundev-pro/log-tstl`

## Установка

```bash
# JS / TS
npm install @fundev-pro/log-ts

# Lua
npm install @fundev-pro/log-tstl
```

## Быстрый старт (JS/TS)

```typescript
import { createLogger } from '@fundev-pro/log-ts';

const logger = createLogger('MyApp');
logger.info('Hello from JS/TS');
```

## Быстрый старт (Lua)

```lua
local log = require("index") -- путь зависит от того, как вы подключите пакет
local createLogger = log.createLogger

local logger = createLogger("MyApp")
logger:info("Hello from Lua")
```

## Подробная документация

- JS/TS: см. `README.tstjs.md`
- Lua: см. `README.tstl.md`
