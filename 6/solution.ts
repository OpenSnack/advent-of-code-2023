import { range, run } from '../helpers';

function getFirstWin(time: number, distance: number) {
    let holdMillis = 1;
    while (holdMillis * (time - holdMillis) <= distance) {
        holdMillis += 1;
    }
    return holdMillis;
}

function getNumWins(time: number, firstWin: number) {
    return time - firstWin * 2 + 1;
}

function aoc2023_6a(input: string[]) {
    const times = input[0].split(/\s+/).slice(1).map(Number);
    const distances = input[1].split(/\s+/).slice(1).map(Number);
    return times.map(
        (time, i) => getNumWins(time, getFirstWin(time, distances[i]))
    ).reduce((acc, val) => acc * val);
}

function aoc2023_6b(input: string[]) {
    const time = Number(input[0].match(/\d+/g).join(''));
    const distance = Number(input[1].match(/\d+/g).join(''));
    return getNumWins(time, getFirstWin(time, distance));
}

(async () => {
    await run(aoc2023_6a, '6/input.txt');
    await run(aoc2023_6b, '6/input.txt');
})();
