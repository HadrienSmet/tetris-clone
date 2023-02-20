import { ReactElement, useEffect, useRef } from "react";
import { theTetrominoes } from "../data/tetrominoes";
const width = 10;
const divs: ReactElement[] = [];
for (let i = 0; i < 200; i++) {
    divs.push(<div key={i}></div>);
}
for (let i = 0; i < 10; i++) {
    divs.push(<div className="taken original-taken" key={i + "-taken"}></div>);
}

const displayDivs: ReactElement[] = [];
for (let i = 0; i < 16; i++) {
    displayDivs.push(<div key={i + "-displayer"}></div>);
}
// const lTetrominoes = [
//     [1, width + 1, width * 2 + 1, 2],
//     [width, width + 1, width + 2, width * 2 + 2],
//     [1, width + 1, width * 2 + 1, width * 2],
//     [width, width * 2, width * 2 + 1, width * 2 + 2],
// ];
// const sTetrominoes = [
//     [width + 1, width + 2, width * 2, width * 2 + 1],
//     [0, width, width + 1, width * 2 + 1],
//     [width + 1, width + 2, width * 2, width * 2 + 1],
//     [0, width, width + 1, width * 2 + 1],
// ];
// const tTetrominoes = [
//     [1, width, width + 1, width + 2],
//     [1, width + 1, width + 2, width * 2 + 1],
//     [width, width + 1, width + 2, width * 2 + 1],
//     [1, width, width + 1, width * 2 + 1],
// ];
// const oTetrominoes = [
//     [0, 1, width, width + 1],
//     [0, 1, width, width + 1],
//     [0, 1, width, width + 1],
//     [0, 1, width, width + 1],
// ];
// const iTetrominoes = [
//     [1, width + 1, width * 2 + 1, width * 3 + 1],
//     [width, width + 1, width + 2, width + 3],
//     [1, width + 1, width * 2 + 1, width * 3 + 1],
//     [width, width + 1, width + 2, width + 3],
// ];

// const theTetrominoes = [
//     lTetrominoes,
//     sTetrominoes,
//     tTetrominoes,
//     oTetrominoes,
//     iTetrominoes,
// ];

let squares: Element[];
let displaySquares: Element[];
let score = 0;
let currentPosition = 4;
let currentRotation = 0;
let random = Math.floor(Math.random() * theTetrominoes.length);
let nextRandom = 0;
let current = theTetrominoes[random][currentRotation];
let interval: number;

const GameContainer = () => {
    const gridRef = useRef<HTMLDivElement | null>(null);

    const displayShape = () => {
        displaySquares.forEach((square) => {
            square.classList.remove("tetromino");
        });
    };

    const draw = () => {
        current.forEach((index) => {
            squares[currentPosition + index].classList.add("tetromino");
        });
    };
    const undraw = () => {
        current.forEach((index) => {
            squares[currentPosition + index].classList.remove("tetromino");
        });
    };

    const freeze = () => {
        if (
            current.some((index) =>
                squares[currentPosition + index + width].classList.contains(
                    "taken"
                )
            )
        ) {
            current.forEach((index) =>
                squares[currentPosition + index].classList.add("taken")
            );
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
            displayShape();
        }
    };
    const rotateTetrominoes = () => {
        undraw();
        currentRotation += 1;
        console.log(currentRotation);

        if (currentRotation === current.length) {
            currentRotation = 0;
        }
        current = theTetrominoes[random][currentRotation];
        draw();
    };

    const moveLeft = () => {
        undraw();
        const isAtLeftEdge = current.some(
            (index) => (currentPosition + index) % width === 0
        );
        if (!isAtLeftEdge) currentPosition--;
        if (
            current.some((index) =>
                squares[currentPosition + index].classList.contains("taken")
            )
        )
            currentPosition++;
        draw();
    };

    const moveRight = () => {
        undraw();
        const isAtRightEdge = current.some(
            (index) => (currentPosition + index) % width === width - 1
        );
        if (!isAtRightEdge) currentPosition++;
        if (
            current.some((index) =>
                squares[currentPosition + index].classList.contains("taken")
            )
        )
            currentPosition--;
        draw();
    };

    const moveDown = () => {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    };

    useEffect(() => {
        const control = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") moveLeft();
            if (e.key === "ArrowRight") moveRight();
            if (e.key === "ArrowUp") rotateTetrominoes();
            if (e.key === "ArrowDown") moveDown();
        };
        interval = setInterval(moveDown, 1000);
        squares = Array.from(document.querySelectorAll(".grid div"));
        document.addEventListener("keydown", control);

        return () => {
            clearInterval(interval);
            document.removeEventListener("keydown", control);
        };
    }, []);

    return (
        <>
            <h3>
                Score: <span id="score">{score}</span>
            </h3>
            <button>Start/Pause</button>
            <div ref={gridRef} className="grid">
                {divs}
            </div>
            <div className="mini-grid">{displayDivs}</div>
        </>
    );
};

export default GameContainer;
