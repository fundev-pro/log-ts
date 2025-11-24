import { LogEvent } from '../../core';
import { RowSelectionRule } from './row-selection-rule';

export interface ConsoleTargetOptions {
    layout: (logEvent: LogEvent) => unknown[];
    printFunction?: (...args: unknown[]) => void;
    rowSelectionRules?: RowSelectionRule[];
    rowSelectionHandler?: (logEvent: LogEvent, options: ConsoleTargetOptions) => unknown[];
}
