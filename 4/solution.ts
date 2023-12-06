import { addUp, range, run } from '../helpers';

const cardCards: Record<string, number> = {};

function intersection<T>(a: Set<T>, b: Set<T>) {
    return new Set(
        Array.from(a).filter(x => b.has(x))
    );
}

function getCardMatches(line: string) { 
    const [card, them, us] = line.split(/:\s+|\s+\|\s+/);
    const themSet = new Set(them.split(/\s+/).map(Number));
    const usSet = new Set(us.split(/\s+/).map(Number));
    return {
        id: Number(card.split(/\s+/)[1]) - 1,
        matches: intersection(themSet, usSet)
    };
}

function getCardValue(line: string) {
    const numMatches = getCardMatches(line).matches.size;
    return numMatches === 0 ? 0 : 2 ** (numMatches - 1);
}

function getCardCards(line: string) {
    const { id, matches } = getCardMatches(line);
    return range(id + 1, id + matches.size + 1);
}

function aoc2023_4a(input: string[]) {
    return addUp(input, line => getCardValue(line));
}

function aoc2023_4b(input: string[]) {
    input.forEach((line, i) => { cardCards[i] = 1; });
    input.forEach((line, i) => {
        getCardCards(line).forEach(card => {
            if (card < input.length) {
                cardCards[card] += cardCards[i];
            }
        });
    });
    return Object.values(cardCards).reduce((acc, val) => acc + val, 0);
}

(async () => {
    await run(aoc2023_4a, '4/input.txt');
    await run(aoc2023_4b, '4/input.txt');
})();