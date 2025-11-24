import { LogEvent, LogTarget } from '../../core';
import { ConsoleTargetOptions } from './console-target-options';

declare const console: {
    log: (...args: unknown[]) => void;
};

export class ConsoleTarget implements LogTarget {
    private print: (...args: unknown[]) => void;
    private rowSelectionHandler: (logEvent: LogEvent, options: ConsoleTargetOptions) => unknown[];

    constructor(private options: ConsoleTargetOptions) {
        this.print =
            options.printFunction ??
            (typeof console !== 'undefined' ? console.log.bind(console) : () => {});
        this.rowSelectionHandler =
            this.options.rowSelectionHandler ?? rowSelectionHandlerBrowserConsole;
    }

    write(logEvent: LogEvent): void {
        let layout: unknown[];

        if (this.options.rowSelectionRules && this.options.rowSelectionRules.length > 0) {
            layout = this.rowSelectionHandler(logEvent, this.options);
        } else {
            layout = this.options.layout(logEvent);
        }

        this.print(...layout);
    }
}

function rowSelectionHandlerBrowserConsole(
    logEvent: LogEvent,
    options: ConsoleTargetOptions
): unknown[] {
    const layout = options.layout(logEvent);
    const colorRule = options.rowSelectionRules?.find(r => r.predicate(logEvent));

    if (!colorRule) return layout;

    let layoutFormat = '%c';
    const layoutArgs: unknown[] = [`color: ${colorRule.color}`];
    for (const element of layout) {
        if (typeof element === 'string') layoutFormat += element + ' ';
        else {
            layoutFormat += '%o ';
            layoutArgs.push(element);
        }
    }

    return [layoutFormat, ...layoutArgs];
}

export function consoleTarget(options: ConsoleTargetOptions): LogTarget {
    return new ConsoleTarget(options);
}
