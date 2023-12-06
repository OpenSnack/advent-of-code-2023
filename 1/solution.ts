import { addUp, run } from '../helpers';

const wordToDigit = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9
}

const bMatch = /(?=([0-9]|one|two|three|four|five|six|seven|eight|nine))/g;

function getDigit(num: string) {
    const digit = Number(num);
    if (Number.isNaN(digit)) return wordToDigit[num];
    return digit;
}

function mergeDigits(matches: string[]) {
    return Number(`${matches[0]}${matches.slice(-1)[0]}`);
}

function aoc2023_1a(input: string[]) {
    return addUp(input, line => mergeDigits(
        Array.from<string>(line.match(/[0-9]/g))
    ));
}

function aoc2023_1b(input: string[]) {
    const bMatch = /(?=([0-9]|one|two|three|four|five|six|seven|eight|nine))/g;
    return addUp(input, line => mergeDigits(
        Array.from<string[]>(line.matchAll(bMatch)).map(arr => getDigit(arr[1]))
    ));
}

(async () => {
    await run(aoc2023_1a, '1/input.txt');
    await run(aoc2023_1b, '1/input.txt');
})();
