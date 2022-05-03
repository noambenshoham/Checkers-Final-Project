class Pieces {
    constructor(row, col, type, player, imgPath) {
        this.row = row;
        this.col = col;
        this.type = type;
        this.player = player;
        this.img = this.imgToElement(imgPath);
        this.moves = [];
        this.doubleCapturing = undefined;

    }
    imgToElement(imgPath) {
        let newElement = document.createElement('img');
        newElement.src = imgPath;
        newElement.classList.add('img')
        let cell = boardEl.rows[this.row].cells[this.col];
        cell.appendChild(newElement)
        return newElement
    }
    oneStepCellsInfo() {

        let cells = [];
        let direction = 1;
        if (this.player === WHITE_PLAYER) direction = -1;
        cells.push([this.row + direction, this.col + 1])
        cells.push([this.row + direction, this.col - 1])

        if (this.doubleCapturing === true) {
            cells.push([this.row - direction, this.col + 1])
            cells.push([this.row - direction, this.col - 1])
        }
        if (this.type === QUEEN) {
            cells = this.getQueenMoves();
        }
        return this.filterOutBoardCells(cells);
    }
    getPossibleMoves() {
        let possibleMoves = []
        possibleMoves = this.getCaptureMoves();
        if (game.boardData.checkPossibleCaptures() === false)
            possibleMoves = this.getOneStepMoves()
        return possibleMoves
    }
    getCaptureMoves() {
        if (this.player !== game.currentPlayer || game.winner !== undefined)
            return []

        let possibleCaptureMoves = []
        for (const cell of this.oneStepCellsInfo()) {
            let pieceInNextCell = game.boardData.getPiece(cell[0], cell[1])
            if (pieceInNextCell && pieceInNextCell.player !== this.player) {
                let jumpTo = cell;
                if (cell[0] > this.row) jumpTo[0] += 1
                if (cell[0] < this.row) jumpTo[0] -= 1
                if (cell[1] > this.col) jumpTo[1] += 1
                if (cell[1] < this.col) jumpTo[1] -= 1
                let emptyJumpTo = game.boardData.getPiece(jumpTo[0], jumpTo[1])
                if (emptyJumpTo === undefined)
                    possibleCaptureMoves = possibleCaptureMoves.concat([jumpTo])
            }
        }
        possibleCaptureMoves = this.filterOutBoardCells(possibleCaptureMoves);
        return possibleCaptureMoves;
    }
    getOneStepMoves() {
        if (this.player !== game.currentPlayer || game.winner !== undefined)
            return []

        let possibleRegularMoves = []
        for (const cell of this.oneStepCellsInfo()) {
            let pieceInNextCell = game.boardData.getPiece(cell[0], cell[1])
            if (pieceInNextCell === undefined) {
                possibleRegularMoves = possibleRegularMoves.concat([cell])
            }
        }
        possibleRegularMoves = this.filterOutBoardCells(possibleRegularMoves);
        return possibleRegularMoves;
    }
    getQueenMoves() {
        let possibleMoves = []
        possibleMoves = possibleMoves.concat(this.getMovesInDirection(1, 1))
        possibleMoves = possibleMoves.concat(this.getMovesInDirection(1, -1))
        possibleMoves = possibleMoves.concat(this.getMovesInDirection(-1, 1))
        possibleMoves = possibleMoves.concat(this.getMovesInDirection(-1, -1))
        return possibleMoves
    }
    getMovesInDirection(directionRow, directionCol) {
        let result = [];
        for (let i = 1; i < BOARD_SIZE; i++) {
            let row = this.row + directionRow * i;
            let col = this.col + directionCol * i;
            if (game.boardData.getPiece(row, col) === undefined) {
                result.push([row, col]);
            } else if (this.player !== game.boardData.getPiece(row, col).player) {
                result.push([row, col]);
                return result;
            } else if (this.player === game.boardData.getPiece(row, col).player) {
                return result;
            }
        }
        return result;

    }
    filterOutBoardCells(cells) {
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
    findCapturedPieceCell(row, col) {
        let enemyCell = []
        // Changed for finding pieces that captured by queen.
        if (this.row < row) enemyCell.push(row - 1)
        if (this.row > row) enemyCell.push(row + 1)

        if (this.col < col) enemyCell.push(col - 1)
        if (this.col > col) enemyCell.push(col + 1)
        return enemyCell
    }
}
