export * from './internal';

import { printLogConfig } from './print';
import { LogTarget, LogConfig, Logger, DefaultLogger } from './internal';

declare const console: {
    log: (...args: unknown[]) => void;
};

export function createLogger<TLogger, TTargets extends Record<string, LogTarget | (() => LogTarget)>>(
    logger: (new (...args: unknown[]) => TLogger) | string, config?: LogConfig<TTargets>
): Logger {
    if (config) {
        return new DefaultLogger(logger, config);
    }

    if (typeof os !== 'undefined' && typeof print !== 'undefined') {
        return new DefaultLogger(logger, printLogConfig());
    } else {
        throw new Error('Unknown environment, please provide config options');
    }
}
