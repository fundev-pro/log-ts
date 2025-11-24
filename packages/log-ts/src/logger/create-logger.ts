import { configLog } from '../config-log';
import { LogConfig, LogEvent, LogLevel, LogTarget } from '../core';
import { consoleTarget } from '../targets';
import { padEndByRecent } from '../utils';
import { Logger } from './logger';
import { DefaultLogger } from './default-logger';

const recentLoggers: string[] = [];
const recentLevels: string[] = [];
const levelFormat = (e: LogEvent) => padEndByRecent(e.levelName.toUpperCase(), recentLevels);
const loggerFormat = (e: LogEvent) => padEndByRecent(e.logger, recentLoggers);
const timeFormat = (e: LogEvent) => {
    const date = new Date(e.timestamp);
    return `${date.toTimeString().split(' ')[0]}.${date.getMilliseconds().toString().padStart(3, '0')}`;
};

export function createLogger<
    TLogger,
    TTargets extends Record<string, LogTarget | (() => LogTarget)>,
>(logger: (new (...args: unknown[]) => TLogger) | string, config?: LogConfig<TTargets>): Logger {
    if (config) return new DefaultLogger(logger, config);

    const logConfig = configLog({
        minLevelDefault: LogLevel.Trace,
        maxLevelDefault: LogLevel.Error,

        targets: {
            console: consoleTarget({
                layout: e => [
                    `${timeFormat(e)}|${levelFormat(e)}|${loggerFormat(e)}|`,
                    ...e.message,
                ],
            }),
        },

        rules: [{ pattern: '*', writeTo: 'console' }],
    });

    return new DefaultLogger(logger, logConfig);
}
