import { LogLevel } from './log-level';
import { LogFilter } from './log-filter';

export interface LogRule<TTargetKey extends string | number | symbol> {
    pattern: string;
    writeTo?: TTargetKey | TTargetKey[];
    minLevel?: LogLevel;
    maxLevel?: LogLevel;
    children?: LogRule<TTargetKey>[];
    filters?: LogFilter[];
    final?: boolean;
}
