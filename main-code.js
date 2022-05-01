const boardEl = document.createElement("table");
const BOARD_SIZE = 8;
const SOLDIER = 'soldier';
const QUEEN = 'queen';
const BLACK_PLAYER = 'black_player';
const WHITE_PLAYER = 'white_player';

let boardData;
let selectedPiece;
let piece;
let pieceInNextCell;

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
4
window.addEventListener('load', createCheckersBoard);

function onCellClick(row, col) {
    let selectedCell = boardEl.rows[row].cells[col];
    boardData.clearBoard();
    if (selectedPiece && boardData.tryMove(selectedPiece, row, col)) {
        selectedPiece = undefined;
    } else {
        selectedCell.classList.add('selected');
        piece = boardData.getPiece(row, col);
        if (piece) {
            let possibleMoves = []
            for (cell of piece.nextCellsInfo()) {
                pieceInNextCell = boardData.getPiece(cell[0], cell[1])
                if (pieceInNextCell && pieceInNextCell.player !== piece.player) {
                    let jump = cell;
                    // Better than direction of player because backward eat in the future.
                    if (cell[0] > piece.row) jump[0] += 1
                    if (cell[0] < piece.row) jump[0] -= 1
                    if (cell[1] > piece.col) jump[1] += 1
                    if (cell[1] < piece.col) jump[1] -= 1
                    possibleMoves = possibleMoves.concat([jump])
                } else if (pieceInNextCell === undefined) {
                    possibleMoves = possibleMoves.concat([cell])
                }
            }
            piece.moves = possibleMoves;
            boardData.paintPossibleMoves(piece);
        }
        selectedPiece = piece

    }


}
class Pieces {
    constructor(row, col, type, player, imgPath) {
        this.row = row;
        this.col = col;
        this.type = type;
        this.player = player;
        this.img = this.imgToElement(imgPath);
        this.moves = [];

    }
    imgToElement(imgPath) {
        let newElement = document.createElement('img');
        newElement.src = imgPath;
        newElement.classList.add('img')
        let cell = boardEl.rows[this.row].cells[this.col];
        cell.appendChild(newElement)
        return newElement
    }
    nextCellsInfo() {
        let cells = [];
        let direction = 1;
        if (this.player === WHITE_PLAYER) direction = -1;
        cells.push([this.row + direction, this.col + 1])
        cells.push([this.row + direction, this.col - 1])

        let filteredCells = [];
        for (let cell of cells) {
            const absoluteRow = cell[0];
            const absoluteCol = cell[1];
            if (absoluteRow >= 0 && absoluteRow <= 7 && absoluteCol >= 0 && absoluteCol <= 7) {
                filteredCells.push(cell);
            }

        }
        return filteredCells;
    }
}

class BoardData {
    constructor() {
        this.pieces = this.getInitialPieces();
    }
    tryMove(selectedPiece, row, col) {
        if (selectedPiece.moves.some(element => element.toString() === [row, col].toString())) {
            if (Math.abs(selectedPiece.row - row) !== 1) { // eat
                console.log('try eat')
                return true
            } else { // regular move
                let moveTo = boardEl.rows[row].cells[col];
                moveTo.appendChild(selectedPiece.img);
                selectedPiece.row = row;
                selectedPiece.col = col;
                return true
            }
        }
        return false
    }
    clearBoard() {
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                boardEl.rows[i].cells[j].classList.remove('possible-move');
                boardEl.rows[i].cells[j].classList.remove('selected');
            }
        }
    }
    getPiece(row, col) {
        for (const piece of this.pieces) {
            if (piece.row === row && piece.col === col) {
                return piece
            }
        }
    }
    paintPossibleMoves(piece) {
        let possibleMoves = piece.moves;
        for (let possibleMove of possibleMoves) {
            let possibleCell = boardEl.rows[possibleMove[0]].cells[possibleMove[1]];
            possibleCell.classList.add('possible-move');
        }
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