import {
    Dispatch,
    MutableRefObject,
    ReactElement,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from "react";
import { theTetrominoes } from "../data/tetrominoes";
import { upNextTetrominoes } from "../data/tetrominoes";
import MiniGridContainer from "./MiniGridContainer";

type IntervalHookType = {
    isPlaying: boolean;
    setIsPlaying: Dispatch<SetStateAction<boolean>>;
    setIsLost: Dispatch<SetStateAction<boolean>>;
    draw: () => void;
    undraw: () => void;
    gridRef: MutableRefObject<HTMLDivElement | null>;
};

type KeyHookType = {
    isPlaying: boolean;
    draw: () => void;
    undraw: () => void;
    moveDown: () => void;
};

const bestScore = localStorage.getItem("best score");
const width = 10;
const divs: ReactElement[] = [];
for (let i = 0; i < 200; i++) {
    divs.push(<div key={i}></div>);
}
for (let i = 0; i < 10; i++) {
    divs.push(<div className="taken original-taken" key={i + "-taken"}></div>);
}

let squares: Element[];
let displaySquares: NodeListOf<Element>;

let score = 0;

let currentPosition = 4;
let currentRotation = 0;

let random = Math.floor(Math.random() * theTetrominoes.length);
let nextRandom = 0;
let current = theTetrominoes[random][currentRotation];

let interval: number;
let displayIndex = 0;

const useGame = () => {
    const gridRef = useRef<HTMLDivElement | null>(null);

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

    useEffect(() => {
        squares = Array.from(document.querySelectorAll(".grid div"));
        displaySquares = document.querySelectorAll(".mini-grid div");
    }, []);

    return {
        gridRef,
        draw,
        undraw,
    };
};

const useGameOnInterval = ({
    isPlaying,
    setIsPlaying,
    setIsLost,
    draw,
    undraw,
    gridRef,
}: IntervalHookType) => {
    const scoreRef = useRef<HTMLSpanElement | null>(null);
    const moveDown = () => {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    };

    const displayShape = () => {
        displaySquares.forEach((square) => {
            square.classList.remove("tetromino");
        });
        upNextTetrominoes[nextRandom].forEach((index) =>
            displaySquares[displayIndex + index].classList.add("tetromino")
        );
    };

    const addScore = () => {
        for (let i = 0; i < 199; i += width) {
            const row = [
                i,
                i + 1,
                i + 2,
                i + 3,
                i + 4,
                i + 5,
                i + 6,
                i + 7,
                i + 8,
                i + 9,
            ];
            if (
                row.every((index) => squares[index].classList.contains("taken"))
            ) {
                score += 10;
                if (scoreRef.current) scoreRef.current.textContent = `${score}`;
                row.forEach((index) => {
                    squares[index].classList.remove("taken");
                    squares[index].classList.remove("tetromino");
                });

                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach((cell) => gridRef.current?.appendChild(cell));
            }
        }
    };

    const gameOver = () => {
        if (
            current.some((index) =>
                squares[currentPosition + index].classList.contains("taken")
            )
        ) {
            setIsPlaying(false);
            setIsLost(true);
            clearInterval(interval);
            if (bestScore !== null) {
                if (parseInt(bestScore) < score) {
                    localStorage.setItem("best score", `${score}`);
                }
            } else {
                localStorage.setItem("best score", `${score}`);
            }
        }
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
            addScore();
            gameOver();
        }
    };

    useEffect(() => {
        if (isPlaying) interval = setInterval(moveDown, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [isPlaying]);

    return {
        scoreRef,
        moveDown,
    };
};

const useGameOnKeyDown = ({
    isPlaying,
    draw,
    undraw,
    moveDown,
}: KeyHookType) => {
    const rotateTetrominoes = () => {
        undraw();
        currentRotation += 1;

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
    useEffect(() => {
        const control = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") moveLeft();
            if (e.key === "ArrowRight") moveRight();
            if (e.key === "ArrowUp") rotateTetrominoes();
            if (e.key === "ArrowDown") moveDown();
        };

        if (isPlaying) document.addEventListener("keydown", control);

        return () => {
            document.removeEventListener("keydown", control);
        };
    }, [isPlaying]);
};

const GameContainer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLost, setIsLost] = useState(false);
    const { gridRef, draw, undraw } = useGame();
    const { moveDown, scoreRef } = useGameOnInterval({
        isPlaying,
        setIsPlaying,
        setIsLost,
        draw,
        undraw,
        gridRef,
    });
    useGameOnKeyDown({ isPlaying, draw, undraw, moveDown });

    const handleStartButton = () => {
        setIsPlaying((curr) => !curr);
        if (isLost) {
            squares.forEach((square) => {
                if (!square.classList.contains("original-taken"))
                    square.classList.remove("taken");
                square.classList.remove("tetromino");
            });
            score = 0;
            currentPosition = 4;
            random = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            setIsLost(false);
        }
    };

    return (
        <>
            <h1>Tetris Clone</h1>
            <h3>
                Best score: <span id="best-score">{bestScore}</span>
            </h3>
            <h3>
                Score:{" "}
                <span ref={scoreRef} id="score">
                    {score}
                </span>
            </h3>
            <button onClick={handleStartButton}>
                {isPlaying ? "Pause" : "Start"}
            </button>
            <div className="content">
                <div ref={gridRef} className="grid">
                    {divs}
                </div>
                <MiniGridContainer displaySquares={displaySquares} />
            </div>
        </>
    );
};

export default GameContainer;
