import { readFile } from 'node:fs/promises';

export function addUp(input: string[], getLineValue: (line: string, i?: number) => number) {
    return input.reduce((acc, line, i) => {
        return acc + getLineValue(line, i);
    }, 0);
}

export function range(start: number, end: number) {
    return Array(end - start).fill(null).map((_,i) => start + i);
}

export function getLineGroups(input: string[], splitAt: (line: string) => boolean, keepLine = false) {
    return input.reduce<string[][]>((acc, line) => {
        if (splitAt(line)) {
            acc.push([]);
        } else {
            acc.slice(-1)[0].push(line);
        }
        return acc;
    }, [[]]);
}

export async function run(func: (lines: string[]) => void, filename: string): Promise<void> {
    const input = await readFile(filename, 'utf-8');
    console.log(func(input.split('\n')));
}
