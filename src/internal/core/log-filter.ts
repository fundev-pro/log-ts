import { LogEvent } from './log-event';

export interface LogFilter {
    predicate: (le: LogEvent) => boolean;
    mode: 'log' | 'ignore' | 'logFinal' | 'ignoreFinal';
}
