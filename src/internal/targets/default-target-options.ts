import { LogEvent } from '../core';
import { RowSelectionRule } from '../utils';

export interface DefaultTargetOptions {
    layout: (this: void, logEvent: LogEvent) => unknown[];
    printFunction: (this: void, ...args: unknown[]) => void;
    rowSelectionRules?: RowSelectionRule[];
    rowSelectionHandler?: (
        this: void,
        logEvent: LogEvent,
        options: DefaultTargetOptions
    ) => unknown[];
}

export type DefaultTargetOptionsNotNecessarilyPrint = Omit<
    DefaultTargetOptions,
    'printFunction'
> & {
    printFunction?: DefaultTargetOptions['printFunction'];
};
