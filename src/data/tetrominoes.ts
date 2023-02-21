const width = 10;
const tinyWidth = 4;
const lTetrominoes = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
];
const sTetrominoes = [
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
];
const tTetrominoes = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
];
const oTetrominoes = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
];
const iTetrominoes = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
];

export const theTetrominoes = [
    lTetrominoes,
    sTetrominoes,
    tTetrominoes,
    oTetrominoes,
    iTetrominoes,
];

export const upNextTetrominoes = [
    [1, tinyWidth + 1, tinyWidth * 2 + 1, 2],
    [tinyWidth + 1, tinyWidth + 2, tinyWidth * 2, tinyWidth * 2 + 1],
    [1, tinyWidth, tinyWidth + 1, tinyWidth + 2],
    [0, 1, tinyWidth, tinyWidth + 1],
    [1, tinyWidth + 1, tinyWidth * 2 + 1, tinyWidth * 3 + 1],
];
