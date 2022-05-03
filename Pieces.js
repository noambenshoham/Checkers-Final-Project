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
        return this.filterOutBoardCells(cells);
    }
    getPossibleMoves() {
        let possibleMoves = []
        possibleMoves = this.getCaptureMoves();
        if (boardData.checkPossibleCaptures() === false)
            possibleMoves = this.getOneStepMoves()
        return possibleMoves
    }
    getCaptureMoves() {
        if (this.player !== boardData.currentPlayer || boardData.winner !== undefined)
            return []

        let possibleCaptureMoves = []
        for (const cell of this.oneStepCellsInfo()) {
            let pieceInNextCell = boardData.getPiece(cell[0], cell[1])
            if (pieceInNextCell && pieceInNextCell.player !== this.player) {
                let jumpTo = cell;
                if (cell[0] > this.row) jumpTo[0] += 1
                if (cell[0] < this.row) jumpTo[0] -= 1
                if (cell[1] > this.col) jumpTo[1] += 1
                if (cell[1] < this.col) jumpTo[1] -= 1
                let emptyJumpTo = boardData.getPiece(jumpTo[0], jumpTo[1])
                if (emptyJumpTo === undefined)
                    possibleCaptureMoves = possibleCaptureMoves.concat([jumpTo])
            }
        }
        possibleCaptureMoves = this.filterOutBoardCells(possibleCaptureMoves);
        return possibleCaptureMoves;
    }
    getOneStepMoves() {
        if (this.player !== boardData.currentPlayer || boardData.winner !== undefined)
            return []

        let possibleRegularMoves = []
        for (const cell of this.oneStepCellsInfo()) {
            let pieceInNextCell = boardData.getPiece(cell[0], cell[1])
            if (pieceInNextCell === undefined) {
                possibleRegularMoves = possibleRegularMoves.concat([cell])
            }
        }
        possibleRegularMoves = this.filterOutBoardCells(possibleRegularMoves);
        return possibleRegularMoves;
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
    findEatenPieceCell(row, col) {
        let enemyCell = []
        if (this.row < row) enemyCell.push(this.row + 1)
        if (this.row > row) enemyCell.push(this.row - 1)

        if (this.col < col) enemyCell.push(this.col + 1)
        if (this.col > col) enemyCell.push(this.col - 1)
        return enemyCell
    }
}
