export function defaultTimestampProvider(): number {
    if (typeof Date !== 'undefined') {
        return Date.now();
    }
    return 0;
}
