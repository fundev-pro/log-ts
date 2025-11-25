import { LogEvent } from './log-event';

export interface LogTarget {
    write(logEvent: LogEvent): void;
}
