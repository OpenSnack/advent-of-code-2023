import { addUp, run } from '../helpers';

const maximums = {
    red: 12,
    green: 13,
    blue: 14
};

function getGameInfo(line: string) {
    const [game, ...handfulStrings] = line.split(/: |; /);
    const id = Number(game.split(' ')[1]);
    return {
        id,
        handfuls: handfulStrings.map(
            line => line.split(', ').reduce<Record<string, number>>((acc, line) => {
                const [num, colour] = line.split(' ');
                acc[colour] = Number(num);
                return acc;
            }, {})
        )
    };
}

function idOrZero(line: string) {
    const { id, handfuls } = getGameInfo(line);
    if (handfuls.some(h => h.red > maximums.red || h.green > maximums.green || h.blue > maximums.blue)) return 0;
    return id;
}

function cubePower(line: string) {
    const { id, handfuls } = getGameInfo(line);
    const red = Math.max(...handfuls.map(h => h.red ?? 0));
    const green = Math.max(...handfuls.map(h => h.green ?? 0));
    const blue = Math.max(...handfuls.map(h => h.blue ?? 0));
    return red * green * blue;
}

function aoc2023_2a(input: string[]) {
    return addUp(input, line => idOrZero(line));
}

function aoc2023_2b(input: string[]) {
    return addUp(input, line => cubePower(line));
}

(async () => {
    await run(aoc2023_2a, '2/input.txt');
    await run(aoc2023_2b, '2/input.txt');
})();
