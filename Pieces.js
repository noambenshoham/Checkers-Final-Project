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

        return this.filterCells(cells);
    }
    getJumpOrStepMoves() {
        if (this.player !== boardData.currentPlayer)
            return []

        let possibleMoves = []
        for (const cell of this.nextCellsInfo()) {
            let pieceInNextCell = boardData.getPiece(cell[0], cell[1])
            if (pieceInNextCell && pieceInNextCell.player !== piece.player) {
                let jumpTo = cell;
                // Better than direction of player because backward eat in the future.
                if (cell[0] > piece.row) jumpTo[0] += 1
                if (cell[0] < piece.row) jumpTo[0] -= 1
                if (cell[1] > piece.col) jumpTo[1] += 1
                if (cell[1] < piece.col) jumpTo[1] -= 1
                let emptyJumpTo = boardData.getPiece(jumpTo[0], jumpTo[1])
                if (emptyJumpTo === undefined)
                    possibleMoves = possibleMoves.concat([jumpTo])
            } else if (pieceInNextCell === undefined) {
                possibleMoves = possibleMoves.concat([cell])
            }
        }
        possibleMoves = this.filterCells(possibleMoves);
        return possibleMoves;
    }
    findEnemyCell(row, col) {
        let enemyCell = []
        if (this.row < row) enemyCell.push(this.row + 1)
        if (this.row > row) enemyCell.push(this.row - 1)
        if (this.col < col) enemyCell.push(this.col + 1)
        if (this.col > col) enemyCell.push(this.col - 1)
        return enemyCell
    }
    filterCells(outBoardCells) {
        // Out of border:
        let filteredCells = [];
        for (let cell of outBoardCells) {
            const absoluteRow = cell[0];
            const absoluteCol = cell[1];
            if (absoluteRow >= 0 && absoluteRow <= 7 && absoluteCol >= 0 && absoluteCol <= 7) {
                filteredCells.push(cell);
            }

        }
        return filteredCells;
    }
}
