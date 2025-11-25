export * from './internal';

import { consoleLogConfig } from './console';
import { LogTarget, LogConfig, Logger, DefaultLogger } from './internal';

declare const console: {
    log: (...args: unknown[]) => void;
};

export function createLogger<TLogger, TTargets extends Record<string, LogTarget | (() => LogTarget)>>(
    logger: (new (...args: unknown[]) => TLogger) | string, config?: LogConfig<TTargets>
): Logger {
    logger = typeof logger == 'string' ? logger : logger.name.replace(/^_/, '');
    if (config) {
        return new DefaultLogger(logger, config);
    }

    if (typeof Date !== 'undefined' && typeof console !== 'undefined') {
        return new DefaultLogger(logger, consoleLogConfig());
    } else {
        throw new Error('Unknown environment, please provide config options');
    }
}
