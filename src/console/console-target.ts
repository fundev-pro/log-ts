import { LogTarget, DefaultTargetOptions, DefaultTarget, DefaultTargetOptionsNotNecessarilyPrint, LogLevel } from "../internal";
import { rowSelectionHandlerConsole } from "./row-selection-handler-console";

export declare const console: {
    log: (...args: unknown[]) => void;
};

export function consoleTarget(options: DefaultTargetOptionsNotNecessarilyPrint): LogTarget {
    const fullOptions: DefaultTargetOptions = {
        ...options,
        printFunction: options.printFunction ?? ((...args: unknown[]) => console.log(...args)),
        rowSelectionRules: options.rowSelectionRules ?? [
            { predicate: e => e.level == LogLevel.Trace, color: 'darkgray' },
            { predicate: e => e.level == LogLevel.Debug, color: 'cyan' },
            { predicate: e => e.level == LogLevel.Info, color: 'white' },
            { predicate: e => e.level == LogLevel.Warn, color: 'orange' },
            { predicate: e => e.level == LogLevel.Error, color: 'red' },
        ],
        rowSelectionHandler: options.rowSelectionHandler ?? rowSelectionHandlerConsole,
    };
    return new DefaultTarget(fullOptions);
}
