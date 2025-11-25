import {
    LogTarget,
    DefaultTargetOptions,
    DefaultTarget,
    DefaultTargetOptionsNotNecessarilyPrint,
} from '../internal';

export function printTarget(options: DefaultTargetOptionsNotNecessarilyPrint): LogTarget {
    const fullOptions: DefaultTargetOptions = {
        ...options,
        printFunction: options.printFunction ?? ((...args: unknown[]) => print(...args)),
    };
    return new DefaultTarget(fullOptions);
}
