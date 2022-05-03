class BoardData {
    constructor() {
        this.pieces = this.getInitialPieces();
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
                let eatenPieceCell = selectedPiece.findEatenPieceCell(row, col);
                this.removedPiece = this.removePiece(eatenPieceCell[0], eatenPieceCell[1]);
                boardEl.rows[eatenPieceCell[0]].cells[eatenPieceCell[1]].innerHTML = '';
            }
            selectedPiece.row = row;
            selectedPiece.col = col;
            let moveTo = boardEl.rows[row].cells[col];
            moveTo.appendChild(selectedPiece.img);
            return true
        }
        return false
    }
    doubleCaptureIsOption(selectedPiece) {
        if (this.removedPiece) {
            selectedPiece.doubleCapturing = true;
            selectedPiece.moves = selectedPiece.getCaptureMoves();
            if (selectedPiece.moves.length !== 0) {
                this.removedPiece = undefined;
                return true
            }
        }
    }
    endTurn() {
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

        for (const piece of this.pieces) {
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
    checkPossibleCaptures() {
        // No need to check who is the current player. It will return an empty array anyway.
        let possibleCaptures = [];
        for (const piece of this.pieces) {
            possibleCaptures = possibleCaptures.concat(piece.getCaptureMoves())
        }
        if (possibleCaptures.length === 0) return false
    }
    removePiece(row, col) {
        for (let i = 0; i < this.pieces.length; i++) {
            const piece = this.pieces[i];
            if (piece.row === row && piece.col === col) {
                this.pieces.splice(i, 1);
                return piece
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
    clearBoard() {
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                boardEl.rows[i].cells[j].classList.remove('possible-move');
                boardEl.rows[i].cells[j].classList.remove('selected');
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