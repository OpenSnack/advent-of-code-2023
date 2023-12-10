import { lcm, run } from '../helpers';

type Location = {
    id: string;
    L: string;
    R: string;
};

function getLocations(input: string[]) {
    return input.reduce<Record<string, Location>>((acc, line) => {
        const [ id, L, R ] = line.split(/ = \(|, /);
        acc[id] = { id, L, R: R.slice(0, -1) }
        return acc;
    }, {});
}

function getStepsTo(
    instructions: string[],
    locations: Record<string, Location>,
    start: string,
    verify: (loc: string) => boolean
) {
    let currentLocation = start;
    let steps = 0;
    while (!verify(currentLocation)) {
        for (const inst of instructions) {
            currentLocation = locations[currentLocation][inst];
            steps += 1;
            if (verify(currentLocation)) return steps;
        }
    }
}

function aoc2023_8a(input: string[]) {
    const instructions = input[0].split('');
    const locations = getLocations(input.slice(2));
    return getStepsTo(
        instructions,
        locations,
        'AAA',
        loc => loc === 'ZZZ'
    );
}

function aoc2023_8b(input: string[]) {
    const instructions = input[0].split('');
    const locations = getLocations(input.slice(2));
    const startLocations = Object.keys(locations).filter(id => id.endsWith('A'));
    const stepsEach = startLocations.map(loc => getStepsTo(
        instructions,
        locations,
        loc,
        loc => loc.endsWith('Z')
    ));
    return lcm(stepsEach);
}

(async () => {
    await run(aoc2023_8a, '8/input.txt');
    await run(aoc2023_8b, '8/input.txt');
})();
