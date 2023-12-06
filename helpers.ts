import { readFile } from 'node:fs/promises';

export function addUp(input: string[], getLineValue: (line: string) => number) {
    return input.reduce((acc, line) => {
        return acc + getLineValue(line);
    }, 0);
}

export async function run(func: (lines: string[]) => void, filename: string): Promise<void> {
    const input = await readFile(filename, 'utf-8');
    console.log(func(input.split('\n')));
}
