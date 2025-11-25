import type { LogEvent, LogTarget } from '../core';
import { DefaultTargetOptions } from './default-target-options';

export class DefaultTarget implements LogTarget {
    constructor(private options: DefaultTargetOptions) {}

    write(logEvent: LogEvent): void {
        let layout: unknown[];

        if (
            this.options.rowSelectionRules &&
            this.options.rowSelectionRules.length > 0 &&
            this.options.rowSelectionHandler
        ) {
            layout = this.options.rowSelectionHandler(logEvent, this.options);
        } else {
            layout = this.options.layout(logEvent);
        }

        this.options.printFunction(...layout);
    }
}

export function defaultTarget(options: DefaultTargetOptions): LogTarget {
    return new DefaultTarget(options);
}
