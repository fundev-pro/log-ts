
import { LogEvent, padEndByRecent, configLog, LogLevel } from "../internal";
import { consoleTarget } from "./console-target";

const recentLoggers: string[] = [];
const recentLevels: string[] = [];
const levelFormat = (e: LogEvent) => padEndByRecent(e.levelName.toUpperCase(), recentLevels);
const loggerFormat = (e: LogEvent) => padEndByRecent(e.logger, recentLoggers);;
const timeFormat = (e: LogEvent) => {
    const date = new Date(e.timestamp);
    return `${date.toTimeString().split(' ')[0]}.${date.getMilliseconds().toString().padStart(3, '0')}`;
};

export const consoleLogConfig = () => configLog({
    minLevelDefault: LogLevel.Trace,
    maxLevelDefault: LogLevel.Error,

    targets: {
        console: consoleTarget({
            layout: e => [
                `${timeFormat(e)}|${levelFormat(e)}|${loggerFormat(e)}|`,
                ...e.message,
            ]
        }),
       
    },
    timestampProvider: () => Date.now(),

    rules: [{ pattern: '*', writeTo: 'console' }],
});


