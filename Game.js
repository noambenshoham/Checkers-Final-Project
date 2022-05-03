class Game {
    constructor() {
        this.boardData = new BoardData();
        this.currentPlayer = WHITE_PLAYER;
        this.winner = undefined;
        this.removedPiece = undefined;
    }
    tryMove(selectedPiece, row, col) {
        // Returns true if the selected cell is in the possible move options.
        if (selectedPiece.moves.some(element => element.toString() === [row, col].toString())) {
            // By the absolute distance of the move - check if clicked in mind to capture.
            // Capture if true
            if (Math.abs(selectedPiece.row - row) !== 1) {
                let capturedPieceCell = selectedPiece.findCapturedPieceCell(row, col);
                this.removedPiece = this.boardData.removePiece(capturedPieceCell[0], capturedPieceCell[1]);
                boardEl.rows[capturedPieceCell[0]].cells[capturedPieceCell[1]].innerHTML = '';
            }
            selectedPiece.row = row;
            selectedPiece.col = col;
            let moveTo = boardEl.rows[row].cells[col];
            moveTo.appendChild(selectedPiece.img);
            return true
        }
        return false
    }
    endTurn(selectedPiece) {
        this.trySoldierToQueen(selectedPiece);
        this.switchTurns();
        this.isGameOver()

        selectedPiece.moves = [];
        this.removedPiece = undefined;
        selectedPiece.doubleCapturing = undefined;
        selectedPiece = undefined;
    }
    trySoldierToQueen(selectedPiece) {
        if (selectedPiece.player === WHITE_PLAYER && selectedPiece.row === 0) {
            selectedPiece.type = QUEEN;
            selectedPiece.img.closest("td").innerHTML = ''
            selectedPiece.img = selectedPiece.imgToElement("/images/whiteQueen.jpg")
        }
        if (selectedPiece.player === BLACK_PLAYER && selectedPiece.row === 7) {
            selectedPiece.type = QUEEN;
            selectedPiece.img.closest("td").innerHTML = ''
            selectedPiece.img = selectedPiece.imgToElement("/images/blackQueen.jpg")

        }
    }
    switchTurns() {
        if (this.currentPlayer === WHITE_PLAYER) {
            this.currentPlayer = BLACK_PLAYER;
        } else {
            this.currentPlayer = WHITE_PLAYER;
        }
    }
    isGameOver() {
        // After ending turns because maybe an option will be open after the enemy move.
        let whitePieces = 0
        let blackPieces = 0
        let hasLegalMoves = []

        for (const piece of this.boardData.pieces) {
            if (piece.player === WHITE_PLAYER)
                whitePieces++;
            else blackPieces++;
            if (piece.player === this.currentPlayer) {
                piece.moves = piece.getPossibleMoves()
                hasLegalMoves = hasLegalMoves.concat(piece.moves)
            }
        }

        if (whitePieces === 0) this.winner = BLACK_PLAYER;
        if (blackPieces === 0) this.winner = WHITE_PLAYER;
        if (hasLegalMoves.length === 0) {
            if (this.currentPlayer === WHITE_PLAYER) {
                this.winner = BLACK_PLAYER;
            } else {
                this.winner = WHITE_PLAYER;
            }
        }

        if (this.winner) {
            let winnerMessage = document.createElement('div')
            winnerMessage.classList.add('winner')
            winnerMessage.innerHTML = 'The winner is: ' + this.winner;
            boardEl.appendChild(winnerMessage);
        }
    }
}