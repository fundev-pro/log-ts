function padByRecent(
    value: string,
    recentValues: string[],
    byStart: boolean,
    fillString = ' ',
    maxCount = 10
): string {
    recentValues.push(value);
    if (recentValues.length > maxCount) recentValues.shift();

    const padWidth = Math.max(...recentValues.map(x => x.length), value.length);
    return byStart ? value.padStart(padWidth, fillString) : value.padEnd(padWidth, fillString);
}

export function padEndByRecent(
    value: string,
    recentValues: string[],
    fillString = ' ',
    maxCount = 10
): string {
    return padByRecent(value, recentValues, false, fillString, maxCount);
}

export function padStartByRecent(
    value: string,
    recentValues: string[],
    fillString = ' ',
    maxCount = 10
): string {
    return padByRecent(value, recentValues, true, fillString, maxCount);
}
