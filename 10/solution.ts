import { fill, run } from '../helpers';

type Cell = {
    row: number;
    col: number;
}

const pipes = ['S', '|', '-', 'L', 'J', 'F', '7'] as const;
type Pipe = typeof pipes[number];
const directions = ['above', 'below', 'right', 'left'] as const;
type Direction = typeof directions[number];

type Grid = (Pipe | '.')[][];

const validConnsByCurrent: Record<Pipe, Direction[]> = {
    S: ['above', 'below', 'right', 'left'],
    '|': ['above', 'below'],
    '-': ['right', 'left'],
    L: ['above', 'right'],
    J: ['above', 'left'],
    F: ['below', 'right'],
    '7': ['below', 'left']
};

const validConnsByNext: Record<Pipe, Direction[]> = {
    S: ['above', 'below', 'right', 'left'],
    '|': ['above', 'below'],
    '-': ['right', 'left'],
    L: ['below', 'left'],
    J: ['below', 'right'],
    F: ['above', 'left'],
    '7': ['above', 'right']
}

const printPathChars: Record<string, string> = {
    S: 'S',
    '|': '│',
    '-': '─',
    L: '└',
    J: '┘',
    F: '┌',
    '7': '┐',
    '.': ' ',
    ' ': ' '
}

const connect = {
    above({ row, col }: Cell): Cell {
        return { row: row - 1, col };
    },
    below({ row, col }: Cell): Cell {
        return { row: row + 1, col };
    },
    right({ row, col }: Cell): Cell {
        return { row, col: col + 1 };
    },
    left({ row, col }: Cell): Cell {
        return { row, col: col - 1 };
    }
}

function getValue(grid: Grid, { row, col }: Cell): Pipe | '.' {
    return grid[row][col];
}

function makeGrid(input: string[]): Grid {
    // there's also . but eh
    return input.map(line => line.split('') as Pipe[]);
}

function getSPosition(grid: Grid): Cell {
    const sRowFindS = grid.map(row => row.findIndex(cell => cell === 'S'));
    const sRowIndex = sRowFindS.findIndex(row => row >= 0);
    const sColIndex = grid[sRowIndex].indexOf('S');
    return {
        row: sRowIndex,
        col: sColIndex
    };
}

function getConnections(grid: Grid, cell: Cell): [Cell, Cell] {
    const connections: Cell[] = [];
    for (const direction of validConnsByCurrent[getValue(grid, cell)]) {
        const tryConn = connect[direction](cell);
        if (validConnsByNext[getValue(grid, tryConn)].includes(direction)) {
            connections.push(tryConn);
        }
        if (connections.length === 2) return connections as [Cell, Cell];
    }
    return connections as [Cell, Cell];
}

function getNextConnection(grid: Grid, currCell: Cell, prevCell: Cell) {
    const conns = getConnections(grid, currCell);
    return conns
        .find(({ row, col }) => row !== prevCell.row || col !== prevCell.col);
}

function getCellKey({ row, col }: Cell) {
    return `${row}//${col}`;
}

function getCellFromKey(key: string): Cell {
    const [row, col] = key.split('//');
    return { row: Number(row), col: Number(col) };
}

function printPath(grid: Grid, cells: Set<string>) {
    const printGrid = fill(fill(null, 140), 140).map((row, i) => row.map((cell, j) => {
        const thisCell = { row: i, col: j };
        if (cells.has(getCellKey(thisCell))) return getValue(grid, thisCell);
        return ' ';
    }));
    printGrid.forEach(row => {
        console.log(row.map(c => printPathChars[c]).join(''));
    });
}

function aoc2023_10a(input: string[]) {
    const grid = makeGrid(input);
    const sPos = getSPosition(grid);
    let currentPositions = getConnections(grid, sPos);
    let prevPositions: [Cell, Cell] = [sPos, sPos];
    let steps = 1;
    while (
        (currentPositions[0].row !== currentPositions[1].row || currentPositions[0].col !== currentPositions[1].col)
        && (currentPositions[0].row !== prevPositions[1].row || currentPositions[0].col !== prevPositions[1].col)
    ) {
        const nextConn0 = getNextConnection(grid, currentPositions[0], prevPositions[0]);
        const nextConn1 = getNextConnection(grid, currentPositions[1], prevPositions[1]);
        prevPositions = currentPositions;
        currentPositions = [nextConn0, nextConn1];
        steps += 1;
    }
    return steps;
}

function aoc2023_10b(input: string[]) {
    const grid = makeGrid(input);
    const sPos = getSPosition(grid);
    let currentPosition = getConnections(grid, sPos)[0];
    let prevPosition = sPos;
    const pathCells = new Set([getCellKey(currentPosition)]);
    while (currentPosition.row !== sPos.row || currentPosition.col !== sPos.col) {
        const nextConn = getNextConnection(grid, currentPosition, prevPosition);
        prevPosition = currentPosition;
        currentPosition = nextConn;
        pathCells.add(getCellKey(currentPosition));
    }

    printPath(grid, pathCells);
    // return enclosed;
}

(async () => {
    await run(aoc2023_10a, '10/input.txt');
    await run(aoc2023_10b, '10/input.txt');
})();
