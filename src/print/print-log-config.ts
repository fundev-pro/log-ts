import { LogEvent, padEndByRecent, configLog, LogLevel, defaultTarget } from "../internal";

const recentLoggers: string[] = [];
const recentLevels: string[] = [];
const levelFormat = (e: LogEvent) => padEndByRecent(e.levelName.toUpperCase(), recentLevels);
const loggerFormat = (e: LogEvent) => padEndByRecent(e.logger, recentLoggers);
const timeFormat = (e: LogEvent) => os.date('%Y-%m-%d %H:%M:%S', e.timestamp);
const messagesFormat = (messages: unknown[]) => messages.map(m => m?.toString()).join(' ');

export const printLogConfig = configLog({
    minLevelDefault: LogLevel.Trace,
    maxLevelDefault: LogLevel.Error,

    targets: {
        print: defaultTarget({
            printFunction: (...args) => print(...args),
            layout: e => [
                `${timeFormat(e)}|${levelFormat(e)}|${loggerFormat(e)}|`,
                messagesFormat(e.message),
            ]
        }),
       
    },
    timestampProvider: () => os.time(),

    rules: [{ pattern: '*', writeTo: 'print' }],
});
