import { LogEvent } from "../core";
import { RowSelectionRule } from "../utils";

export interface DefaultTargetOptions {
    layout: (logEvent: LogEvent) => unknown[];
    printFunction: (this: void, ...args: unknown[]) => void;
    rowSelectionRules?: RowSelectionRule[];
    rowSelectionHandler?: (logEvent: LogEvent, options: DefaultTargetOptions) => unknown[];
}
