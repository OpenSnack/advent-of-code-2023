import { addUp, range, run } from '../helpers';

function findWithIndices(line: string, regex: RegExp) {
    const dgRegex = new RegExp(regex, 'dg');
    const matches: { match: string; indices: number[] }[] = [];
    let match = dgRegex.exec(line);
    while (match) {
        matches.push({
            match: match[0],
            indices: range(match.indices[0][0], match.indices[0][1])
        });
        match = dgRegex.exec(line);
    }
    return matches;
}

function expandBy1(indices: number[]) {
    return [indices[0] - 1, ...indices, indices.slice(-1)[0] + 1];
}

function sumOfPartNumbers(line: string, before?: string, after?: string): number {
    const numbers = findWithIndices(line, /\d+/);
    const symbolIndices = [
        ...findWithIndices(line, /[^\d\.]/),
        ...findWithIndices(before ?? '', /[^\d\.]/),
        ...findWithIndices(after ?? '', /[^\d\.]/)
    ].map(sym => sym.indices[0]);

    return numbers.filter(num => {
        const validIndices = expandBy1(num.indices);
        return symbolIndices.some(i => validIndices.includes(i));
    }).reduce((acc, num) => acc + Number(num.match), 0);
}

function sumOfGears(line: string, before?: string, after?: string): number {
    const stars = findWithIndices(line, /\*/);
    const numberIndices = [
        ...findWithIndices(line, /\d+/),
        ...findWithIndices(before ?? '', /\d+/),
        ...findWithIndices(after ?? '', /\d+/)
    ];

    return stars.map(star => {
        const validIndices = expandBy1(star.indices);
        return numberIndices.filter(num => validIndices.some(i => num.indices.includes(i)));
    })
        .filter(nums => nums.length === 2)
        .reduce((acc, nums) => acc + Number(nums[0].match) * Number(nums[1].match), 0);
}

function aoc2023_3a(input: string[]) {
    return addUp(input, (line, i) => sumOfPartNumbers(line, input[i-1], input[i+1]));
}

function aoc2023_3b(input: string[]) {
    return addUp(input, (line, i) => sumOfGears(line, input[i-1], input[i+1]));
}

(async () => {
    await run(aoc2023_3a, '3/input.txt');
    await run(aoc2023_3b, '3/input.txt');
})();
