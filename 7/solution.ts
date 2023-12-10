import { fill, run } from '../helpers';

const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const types = ['HC', '1P', '2P', '3K', 'FH', '4K', '5K'] as const;

type Hand = {
    cards: string[];
    type: typeof types[number];
    bid: number;
};

function buildNormalCardObj(cards: string[]) {
    return cards.reduce<Record<string, number>>((acc, card) => {
        if (!acc[card]) acc[card] = 0;
        acc[card] += 1;
        return acc;
    }, {});
}

function buildJokerCardObj(cards: string[]) {
    const nonJokers = cards.filter(c => c !== 'J');
    const numJokers = cards.length - nonJokers.length;
    const nonJokerEntries = Object.entries(buildNormalCardObj(nonJokers))
        .sort((a, b) => {
            const sortVal = b[1] - a[1];
            if (sortVal) return sortVal;
            return ranks.indexOf(b[0]) - ranks.indexOf(a[0]);
        });
    const bestCard = nonJokerEntries[0]?.[0] ?? 'A';
    return buildNormalCardObj([ ...nonJokers, ...fill(bestCard, numJokers) ]);
}

function identifyHand(cards: string[], useJokers: boolean): typeof types[number] {
    const cardObj = useJokers ? buildJokerCardObj(cards) : buildNormalCardObj(cards);
    const values = Object.values(cardObj);
    if (values.includes(5)) return '5K';
    if (values.includes(4)) return '4K';
    if (values.includes(3)) {
        if (values.includes(2)) return 'FH';
        return '3K';
    }
    if (values.filter(n => n === 2).length === 2) return '2P';
    if (values.filter(n => n === 2).length === 1) return '1P';
    return 'HC';
}

function getHand(line: string, useJokers = false): Hand {
    const [cardStr, bid] = line.split(' ');
    const cards = cardStr.split('');
    return {
        cards,
        type: identifyHand(cards, useJokers),
        bid: Number(bid)
    };
}

function compareHands(a: Hand, b: Hand, useJokers = false) {
    const sortVal = types.indexOf(a.type) - types.indexOf(b.type);
    if (sortVal) return sortVal;
    for (const [i, card] of a.cards.entries()) {
        const rankSortVal = ranks.indexOf(card) - ranks.indexOf(b.cards[i]);
        if (!rankSortVal) continue;
        if (useJokers) {
            if (card === 'J') return -1;
            if (b.cards[i] === 'J') return 1;
        }
        return rankSortVal;
    }
    return 0;
}

function aoc2023_7a(input: string[]) {
    const hands = input.map(line => getHand(line));
    return hands.sort((a, b) => compareHands(a, b))
        .reduce((acc, { bid }, i) => acc + bid * (i + 1), 0);
}

function aoc2023_7b(input: string[]) {
    const hands = input.map(line => getHand(line, true));
    return hands.sort((a, b) => compareHands(a, b, true))
        // .filter(h => h.type === '3K')
        .reduce((acc, { bid }, i) => acc + bid * (i + 1), 0);
}

(async () => {
    await run(aoc2023_7a, '7/input.txt');
    await run(aoc2023_7b, '7/input.txt');
})();
