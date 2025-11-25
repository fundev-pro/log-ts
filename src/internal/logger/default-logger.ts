import { Logger } from './logger';
import { LogLevel, LogFilter, LogRule, LogTarget, LogEvent, LogConfig } from '../core';
import { matchPattern } from '../utils';

export class DefaultLogger<TLogger, TTargets extends Record<string, LogTarget | (() => LogTarget)>>
    implements Logger
{
    private readonly ruleLevels: Record<
        LogLevel,
        { targets?: LogTarget[]; filters?: LogFilter[] }
    > = {
        [LogLevel.Trace]: {},
        [LogLevel.Debug]: {},
        [LogLevel.Info]: {},
        [LogLevel.Warn]: {},
        [LogLevel.Error]: {},
        [LogLevel.Fatal]: {},
    };

    private readonly logger: string;

    constructor(
        logger: (new (...args: unknown[]) => TLogger) | string,
        private config: LogConfig<TTargets>
    ) {
        this.logger = typeof logger == 'string' ? logger : logger.name;
        this.initRules(config.rules);
    }

    private initRules(rules?: LogRule<keyof TTargets>[]): boolean {
        if (!rules) return false;

        let final = false;

        for (const rule of rules) {
            if (matchPattern(this.logger, rule.pattern)) {
                final = rule.final ?? false;

                const childFinal = this.initRules(rule.children);

                const minLevel = rule.minLevel ?? this.config.minLevelDefault;
                const maxLevel = rule.maxLevel ?? this.config.maxLevelDefault;

                for (let j = minLevel; j <= maxLevel; j++) {
                    if (!rule.writeTo) continue;
                    const writeTo = Array.isArray(rule.writeTo) ? rule.writeTo : [rule.writeTo];

                    for (const targetName of writeTo) {
                        const targetRaw = this.config.targets[targetName];
                        const target: LogTarget =
                            typeof targetRaw == 'function' ? targetRaw() : targetRaw;
                        (this.ruleLevels[j].targets ??= []).push(target);
                    }

                    this.ruleLevels[j].filters = rule.filters;
                }

                final = final || childFinal;

                if (final) break;
            }
        }

        return final;
    }

    fatal(message?: unknown, ...optionalParams: unknown[]): void {
        this.log(LogLevel.Fatal, message, ...optionalParams);
    }

    error(message?: unknown, ...optionalParams: unknown[]): void {
        this.log(LogLevel.Error, message, ...optionalParams);
    }

    warn(message?: unknown, ...optionalParams: unknown[]): void {
        this.log(LogLevel.Warn, message, ...optionalParams);
    }

    info(message?: unknown, ...optionalParams: unknown[]): void {
        this.log(LogLevel.Info, message, ...optionalParams);
    }

    debug(message?: unknown, ...optionalParams: unknown[]): void {
        this.log(LogLevel.Debug, message, ...optionalParams);
    }

    trace(message?: unknown, ...optionalParams: unknown[]): void {
        this.log(LogLevel.Trace, message, ...optionalParams);
    }

    log(level: LogLevel, message?: unknown, ...optionalParams: unknown[]): void {
        const ruleLevels = this.ruleLevels[level];

        if (!ruleLevels.targets) return;

        const timestamp = this.config.timestampProvider()

        for (const target of ruleLevels.targets) {
            let isLog = true;
            let isFinal = false;

            const logEvent = new LogEvent(
                this.logger,
                level,
                [message, ...optionalParams],
                timestamp
            );

            if (ruleLevels.filters) {
                for (const filter of ruleLevels.filters) {
                    if (filter.predicate(logEvent)) {
                        if (filter.mode == 'logFinal') {
                            isFinal = true;
                        } else if (filter.mode == 'ignore') {
                            isLog = false;
                        } else if (filter.mode == 'ignoreFinal') {
                            isLog = false;
                            isFinal = true;
                        }
                    }
                }
            }

            if (isLog) target.write(logEvent);

            if (isFinal) break;
        }
    }
}
