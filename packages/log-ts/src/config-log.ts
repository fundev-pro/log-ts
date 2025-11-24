import { LogConfig, LogTarget } from './core';

export function configLog<TTargets extends Record<string, LogTarget | (() => LogTarget)>>(
    config: LogConfig<TTargets>
): LogConfig<TTargets> {
    return config;
}
