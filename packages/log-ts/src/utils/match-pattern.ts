export function matchPattern(text: string, pattern: string): boolean {
    if (pattern === text) return true;

    if (pattern === '*') return true;

    let ti = 0;
    let pi = 0;
    let starIdx = -1;
    let matchIdx = 0;

    while (ti < text.length) {
        if (pi < pattern.length && (pattern[pi] === text[ti] || pattern[pi] === '?')) {
            ti++;
            pi++;
        } else if (pi < pattern.length && pattern[pi] === '*') {
            starIdx = pi;
            matchIdx = ti;
            pi++;
        } else if (starIdx !== -1) {
            pi = starIdx + 1;
            matchIdx++;
            ti = matchIdx;
        } else {
            return false;
        }
    }

    while (pi < pattern.length && pattern[pi] === '*') {
        pi++;
    }

    return pi === pattern.length;
}
