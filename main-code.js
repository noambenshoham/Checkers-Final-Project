const boardEl = document.createElement("table");
const BOARD_SIZE = 8;
const SOLDIER = 'soldier';
const QUEEN = 'queen';
const BLACK_PLAYER = 'black_player';
const WHITE_PLAYER = 'white_player';

let boardData;

function createCheckersBoard() {
    boardEl.classList.add("checkersBoard");
    document.body.appendChild(boardEl);
    for (let row = 0; row < BOARD_SIZE; row++) {
        let rowElement = boardEl.insertRow();
        for (let col = 0; col < BOARD_SIZE; col++) {
            let cellElement = rowElement.insertCell();
            if ((row + col) % 2 === 0) { // Zig-Zag 
                cellElement.classList.add("white");
            } else {
                cellElement.classList.add("black");
            }
            cellElement.addEventListener('click', () => onCellClick(row, col));
        }
    }
    boardData = new BoardData();
}

window.addEventListener('load', createCheckersBoard);

function onCellClick(row, col) {
    let selectedCell = boardEl.rows[row].cells[col];
    console.log(selectedCell)
    console.log(boardData.pieces)
}
class Pieces {
    constructor(row, col, type, player, imgPath) {
        this.row = row;
        this.col = col;
        this.type = type;
        this.player = player;
        this.img = this.imgToElement(imgPath);
    }
    imgToElement(imgPath) {
        let newElement = document.createElement('img');
        newElement.src = imgPath;
        newElement.classList.add('img')
        let cell = boardEl.rows[this.row].cells[this.col];
        cell.appendChild(newElement)
        return newElement
    }
}

class BoardData {
    constructor() {
        this.pieces = this.getInitialPieces();
    }
    getInitialPieces() {
        let result = [];
        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                if ((row % 2 === 0 && col % 2 !== 0) || (row % 2 !== 0 && col % 2 === 0)) {
                    if (row <= 2) {
                        result.push(new Pieces(row, col, SOLDIER, BLACK_PLAYER, "/images/blackSoldier.jpg"))
                    } else if (row >= 5) {
                        result.push(new Pieces(row, col, SOLDIER, WHITE_PLAYER, "/images/whiteSoldier.jpg"))
                    }
                }
            }
        }
        return result
    }
}