
import { LogEvent, padEndByRecent, configLog, LogLevel, defaultTarget } from "../internal";
import { rowSelectionHandlerConsole } from "./row-selection-handler-console";

declare const console: {
    log: (...args: unknown[]) => void;
};

const recentLoggers: string[] = [];
const recentLevels: string[] = [];
const levelFormat = (e: LogEvent) => padEndByRecent(e.levelName.toUpperCase(), recentLevels);
const loggerFormat = (e: LogEvent) => padEndByRecent(e.logger, recentLoggers);;
const timeFormat = (e: LogEvent) => {
    const date = new Date(e.timestamp);
    return `${date.toTimeString().split(' ')[0]}.${date.getMilliseconds().toString().padStart(3, '0')}`;
};

export const consoleLogConfig = configLog({
    minLevelDefault: LogLevel.Trace,
    maxLevelDefault: LogLevel.Error,

    targets: {
        console: defaultTarget({
            printFunction: (...args) => console.log(...args),
            layout: e => [
                `${timeFormat(e)}|${levelFormat(e)}|${loggerFormat(e)}|`,
                ...e.message,
            ],
            rowSelectionRules: [
                { predicate: e => e.level == LogLevel.Trace, color: 'darkgray' },
                { predicate: e => e.level == LogLevel.Debug, color: 'cyan' },
                { predicate: e => e.level == LogLevel.Info, color: 'white' },
                { predicate: e => e.level == LogLevel.Warn, color: 'orange' },
                { predicate: e => e.level == LogLevel.Error, color: 'red' },
            ],
            rowSelectionHandler: rowSelectionHandlerConsole,
        }),
       
    },
    timestampProvider: () => Date.now(),

    rules: [{ pattern: '*', writeTo: 'console' }],
});
