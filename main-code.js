const boardEl = document.createElement("table");
const BOARD_SIZE = 8;
const SOLDIER = 'soldier';
const QUEEN = 'queen';
const BLACK_PLAYER = 'black_player';
const WHITE_PLAYER = 'white_player';

let boardData;
let selectedPiece;

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
    boardData.clearBoard();
    if (selectedPiece && boardData.tryMove(selectedPiece, row, col)) {
        selectedPiece.moves = [];
        selectedPiece = undefined;
    } else {
        selectedCell.classList.add('selected');
        selectedPiece = boardData.getPiece(row, col);
        if (selectedPiece) {
            selectedPiece.moves = selectedPiece.getCaptureMoves()
            if (boardData.checkPossibleCaptures() === false)
                selectedPiece.moves = selectedPiece.getOneStepMoves()
            boardData.paintPossibleMoves(selectedPiece);
        }
    }
}

