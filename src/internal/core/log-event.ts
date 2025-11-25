import { LogLevel } from './log-level';

export class LogEvent {
    constructor(
        public logger: string,
        public level: LogLevel,
        public message: unknown[],
        public timestamp: number
    ) {}

    public get levelName(): string {
        return LogLevel[this.level];
    }
}
