import { addUp, run } from '../helpers';

function getNextSequence(sequence: number[]) {
    return sequence.slice(1).map((num, i) => num - sequence[i])
}

function forwards(sequences: number[][]) {
    return sequences.reduce((acc, val) => acc + val.at(-1), 0);
}

function backwards(sequences: number[][]) {
    const source = sequences.reverse().slice(1);
    return source.reduce((acc, val, i) => {
        return source[i][0] - acc;
    }, 0);
}

function extrapolate(line: string, reducer: (sequences: number[][]) => number) {
    const nums = line.split(' ').map(Number);
    const sequences = [nums];
    while (sequences.at(-1).some(num => num)) {
        sequences.push(getNextSequence(sequences.at(-1)))
    }
    return reducer(sequences);
}

function aoc2023_9a(input: string[]) {
    return addUp(input, line => extrapolate(line, forwards));
}

function aoc2023_9b(input: string[]) {
    return addUp(input, line => extrapolate(line, backwards));
}

(async () => {
    await run(aoc2023_9a, '9/input.txt');
    await run(aoc2023_9b, '9/input.txt');
})();
