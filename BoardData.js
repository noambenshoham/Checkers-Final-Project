class BoardData {
    constructor() {
        this.pieces = this.getInitialPieces();
    }
    tryMove(selectedPiece, row, col) {
        if (selectedPiece.moves.some(element => element.toString() === [row, col].toString())) {
            let moveTo = boardEl.rows[row].cells[col];
            if (Math.abs(selectedPiece.row - row) !== 1) { // eat
                let enemyCell = selectedPiece.findEnemyCell(row, col)
                this.removePiece(enemyCell[0], enemyCell[1])
                boardEl.rows[enemyCell[0]].cells[enemyCell[1]].innerHTML = '';
            }
            selectedPiece.row = row;
            selectedPiece.col = col;
            moveTo.appendChild(selectedPiece.img);
            return true
        }
        return false
    }
    removePiece(row, col) {
        for (let i = 0; i < this.pieces.length; i++) {
            const piece = this.pieces[i];
            if (piece.row === row && piece.col === col) {
                this.pieces.splice(i, 1);
            }
        }
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