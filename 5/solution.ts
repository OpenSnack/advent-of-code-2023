import { getLineGroups, range, run } from '../helpers';

type MappingValue = {
    source: number;
    dest: number;
    range: number;
};

function getSeeds(line: string) {
    return line.split(': ')[1].split(' ').map(Number);
}

function getMappings(groups: string[][]) {
    return groups.reduce<Record<string, Record<string, MappingValue[]>>>((acc, group) => {
            const [sourceName,, destName] = group[0].split(/-| /);
            if (!acc[sourceName]) acc[sourceName] = {};
            acc[sourceName][destName] = group.slice(1).map(line => {
                const [dest, source, range] = line.split(' ');
                return {
                    source: Number(source),
                    dest: Number(dest),
                    range: Number(range)
                }
            }).sort((a, b) => a.source - b.source)
            return acc;
        }, {});
}

function getMapOrder(groups: string[][]) {
    return groups
    .flatMap((lines, i) => {
        const [source,, dest] = lines[0].split(/-| /);
        if (i === groups.length - 1) return [source, dest];
        return source;
    });
}

function getMapRanges(values: MappingValue[]): MappingValue[] {
    const ranges = values.reduce<MappingValue[]>((acc, val) => {
        const lastValue = acc.at(-1);
        if (acc.length === 0 && val.source !== 0) {
            acc.push({
                source: 0,
                dest: 0,
                range: val.source
            });
        } else if (lastValue && val.source > lastValue.source + lastValue.range) {
            const source = lastValue.source + lastValue.range;
            acc.push({
                source,
                dest: source,
                range: val.source - (lastValue.source + lastValue.range)
            });
        }
        acc.push(val);
        return acc;
    }, []);
    return ranges;
}

function getMappedSeeds(
    seeds: number[],
    mappings: Record<string, Record<string, MappingValue[]>>,
    order: string[]
): number[] {
    return seeds.map(seed => {
        let currentValue = seed;
        for (const [i, type] of order.entries()) {
            if (!mappings[type]) break;
            const ranges = getMapRanges(mappings[type][order[i + 1]]);
            const matchingRange = ranges.findLast(({ source }) => currentValue >= source);
            currentValue = matchingRange.dest + currentValue - matchingRange.source;
        }
        return currentValue;
    });
}

function getMappedSeedRanges(
    seeds: { start: number; range: number; }[],
    mappings: Record<string, Record<string, MappingValue[]>>,
    order: string[]
): number[] {
    let possibleValues: { start: number; range: number; }[] = seeds;
    for (const [i, type] of order.entries()) {
        if (!mappings[type]) break;
        const mapRanges = getMapRanges(mappings[type][order[i + 1]]);
        possibleValues = possibleValues.flatMap(({ start, range: currentRange }) => {
            const firstMatchingRangeIndex = mapRanges.findLastIndex(({ source }) => start >= source);
            const lastMatchingRangeIndex = mapRanges.findLastIndex(({ source }) => start + currentRange >= source);
            const matchingRanges = mapRanges.slice(firstMatchingRangeIndex, lastMatchingRangeIndex + 1);
            // these conditions caused me great pain and a few sheets of drawing paper
            return matchingRanges.map((r, rI) => {
                if (rI === matchingRanges.length - 1 && start > r.source + r.range) {
                    return {
                        start,
                        range: currentRange
                    };
                }
                if (start >= r.source && start + currentRange >= r.source + r.range) {
                    return {
                        start: r.dest + start - r.source,
                        range: r.source + r.range - start
                    };
                }
                if (r.source >= start && start + currentRange >= r.source + r.range) {
                    return {
                        start: r.dest,
                        range: r.range
                    };
                }
                if (r.source >= start && r.source + r.range >= start + currentRange) {
                    return {
                        start: r.dest,
                        range: start + currentRange - r.source
                    };
                }
                return {
                    start: r.dest + start - r.source,
                    range: currentRange
                };
            });
        });
    }
    return possibleValues.map(v => v.start);
}

function aoc2023_5a(input: string[]) {
    const seeds = getSeeds(input[0]);
    const lineGroups = getLineGroups(input.slice(2), line => line.length === 0);
    const mappings = getMappings(lineGroups);
    const order = getMapOrder(lineGroups);
    const finalValues = getMappedSeeds(seeds, mappings, order);
    return Math.min(...finalValues);
}

function aoc2023_5b(input: string[]) {
    const seeds = getSeeds(input[0]);
    const seedRanges = range(0, seeds.length / 2).map(i => ({
        start: seeds[i * 2],
        range: seeds[i * 2 + 1]
    }));
    const lineGroups = getLineGroups(input.slice(2), line => line.length === 0);
    const mappings = getMappings(lineGroups);
    const order = getMapOrder(lineGroups);
    const finalRanges = getMappedSeedRanges(seedRanges, mappings, order);
    return Math.min(...finalRanges);
}

(async () => {
    await run(aoc2023_5a, '5/input.txt');
    await run(aoc2023_5b, '5/input.txt');
})();
