var Color;
(function (Color) {
    Color[Color["White"] = 0] = "White";
    Color[Color["Black"] = 1] = "Black"; //lowercase
})(Color || (Color = {}));
var ChessPiece = /** @class */ (function () {
    function ChessPiece(code) {
        this.name = code;
        this.colour = (code == code.toUpperCase()) ? Color.White : Color.Black;
    }
    return ChessPiece;
}());
var Vector = /** @class */ (function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    return Vector;
}());
var Chess = /** @class */ (function () {
    function Chess(fen) {
        this.boardLength = 8;
        this.board = [];
        var fenRecordItems = fen.split(" ");
        if (fenRecordItems.length != 6) {
            throw new RangeError("Incorrectly formatted FEN string provided.");
        }
        var boardString = fenRecordItems[0];
        this.setupBoard(boardString);
        var playersTurn = fenRecordItems[1];
        this.turn = playersTurn.toUpperCase() == "W" ? Color.White : Color.Black;
        this.castling = fenRecordItems[2];
        this.enPassant = fenRecordItems[3];
        this.HalfMoveClock = Number(fenRecordItems[4]);
        this.FullMoveNumber = Number(fenRecordItems[5]);
    }
    Chess.prototype.setupBoard = function (boardString) {
        var fenRows = boardString.split("/");
        for (var _i = 0, fenRows_1 = fenRows; _i < fenRows_1.length; _i++) {
            var fenRow = fenRows_1[_i];
            var row = new Array();
            for (var i = 0; i < fenRow.length; i++) {
                var character = fenRow[i];
                var maybeNumber = Number(character);
                if (isNaN(maybeNumber)) {
                    row.push(new ChessPiece(character));
                }
                else {
                    for (var j = 0; j < maybeNumber; j++) {
                        row.push(null);
                    }
                }
            }
            this.board.push(row);
        }
    };
    Chess.prototype.changeTurn = function () {
        this.turn = this.turn == Color.White ? Color.Black : Color.White;
    };
    Chess.prototype.playersTurn = function () {
        return this.turn == Color.White ? "white" : "black";
    };
    Chess.prototype.move = function (from, to) {
        var fromPosition = this.getVector(from);
        var toPosition = this.getVector(to);
        var pieceToMove = this.board[fromPosition.y][fromPosition.x];
        this.board[fromPosition.y][fromPosition.x] = null;
        this.board[toPosition.y][toPosition.x] = pieceToMove;
        this.changeTurn();
    };
    Chess.prototype.getVector = function (location) {
        var verticalOffset = this.boardLength;
        var alphabet = "ABCDEFGH";
        var x = 0;
        var y = 0;
        for (var i = 0; i < alphabet.length; i++) {
            if (location[0].toLocaleUpperCase() == alphabet[i]) {
                x = i;
            }
        }
        y = verticalOffset - Number(location[1]);
        return new Vector(x, y);
    };
    Chess.prototype.ascii = function () {
        var boardStr = "";
        var horizontalBorder = "  +" + Array(this.board.length * 3).join('-') + "-+\n";
        boardStr += horizontalBorder;
        var verticalAxis = this.boardLength;
        for (var _i = 0, _a = this.board; _i < _a.length; _i++) {
            var row = _a[_i];
            boardStr += verticalAxis-- + " |";
            for (var _b = 0, row_1 = row; _b < row_1.length; _b++) {
                var chessPiece = row_1[_b];
                boardStr += chessPiece == null ? " . " : " " + chessPiece.name + " ";
            }
            boardStr += "|\n";
        }
        boardStr += horizontalBorder;
        boardStr += "   ";
        var horizontalAxisLabels = "ABCDEFGH";
        for (var i = 0; i < this.boardLength; i++) {
            boardStr += " " + horizontalAxisLabels[i] + " ";
        }
        return boardStr;
    };
    Chess.prototype.FEN = function () {
        var fenStr = "";
        for (var row = 0; row < this.boardLength; row++) {
            if (row > 0) {
                fenStr += "/";
            }
            var blankCount = 0;
            for (var _i = 0, _a = this.board[row]; _i < _a.length; _i++) {
                var chessPiece = _a[_i];
                if (chessPiece == null) {
                    blankCount++;
                }
                else {
                    if (blankCount > 0) {
                        fenStr += blankCount;
                    }
                    fenStr += chessPiece.name;
                    blankCount = 0;
                }
            }
            if (blankCount > 0) {
                fenStr += blankCount;
            }
        }
        fenStr += " " + (this.turn == Color.White ? "w" : "b") + " ";
        fenStr += " " + this.castling + " " + this.enPassant + " " + this.HalfMoveClock + " " + this.FullMoveNumber;
        return fenStr;
    };
    return Chess;
}());
//# sourceMappingURL=Chess.js.map