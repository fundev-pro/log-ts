import { LogLevel } from './log-level';
import { LogRule } from './log-rule';
import { LogTarget } from './log-target';

export interface LogConfig<TTargets extends Record<string, LogTarget | (() => LogTarget)>> {
    minLevelDefault: LogLevel;
    maxLevelDefault: LogLevel;
    targets: TTargets;
    rules: LogRule<keyof TTargets>[];
    timestampProvider?: () => number;
}
