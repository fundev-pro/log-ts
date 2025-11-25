import type { LogEvent } from '../core';

export interface RowSelectionRule {
    predicate: (logEvent: LogEvent) => boolean;
    color: string;
}
