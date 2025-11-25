import { LogEvent, DefaultTargetOptions } from "../internal";


export function rowSelectionHandlerConsole(
    logEvent: LogEvent,
    options: DefaultTargetOptions
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


