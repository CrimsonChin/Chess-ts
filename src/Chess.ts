enum Color {
    White,  //uppercase
    Black //lowercase
}

class ChessPiece {
    public name: string;
    public colour: Color;

    constructor(code: string){
        this.name = code;
        this.colour = (code == code.toUpperCase()) ? Color.White : Color.Black; 
    }
}

class Vector {
    public x: number;
    public y: number;

    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
    }
}

class Chess {
    readonly boardLength: number = 8;
    private board: ChessPiece[][];
    private turn: Color;

    constructor(fen: string){
        this.board = [];

        let fenRecordItems = fen.split(" ");

        if (fenRecordItems.length != 6){
            throw new RangeError("Incorrectly formatted FEN string provided.");
        }

        let boardString = fenRecordItems[0];
        this.setupBoard(boardString);

        let playersTurn = fenRecordItems[1];
        this.turn = playersTurn.toUpperCase() == "W" ? Color.White : Color.Black;
    }

    private setupBoard(boardString: string){
        let fenRows = boardString.split("/");

        for (let fenRow of fenRows){
            let row = new Array<ChessPiece>();

            for (let i = 0; i < fenRow.length; i++) {
                let character = fenRow[i];
                let maybeNumber = Number(character);
                if(isNaN(maybeNumber)){ 
                    row.push(new ChessPiece(character));
                } else {
                    for(let j = 0; j < maybeNumber; j++){
                        row.push(null);
                    }
                }
            }

            this.board.push(row);
        }
    }

    private changeTurn(){
        this.turn = this.turn == Color.White ? Color.Black : Color.White;
    }

    public playersTurn(){
        return  this.turn == Color.White ? "white" : "black";
    }

    public move(from: string, to: string){
        var fromPosition = this.getVector(from);
        var toPosition = this.getVector(to);

        var pieceToMove = this.board[fromPosition.y][fromPosition.x];

        this.board[fromPosition.y][fromPosition.x] = null;
        this.board[toPosition.y][toPosition.x] = pieceToMove;

        this.changeTurn();
    }

    private getVector(location: string){
        const verticalOffset = this.boardLength;
        const alphabet = "ABCDEFGH";
        let x = 0;
        let y = 0;

        for (let i = 0; i < alphabet.length; i++){
            if (location[0].toLocaleUpperCase() == alphabet[i]){
                x = i;
            }
        }

        y = verticalOffset - Number(location[1]);
        return new Vector(x, y);
    }

    public ascii(){
        let boardStr = "";

        let horizontalBorder = `  +${Array(this.board.length * 3).join('-')}-+\n`;

        boardStr += horizontalBorder;

        let verticalAxis = this.boardLength;
        for (let row of this.board){
            boardStr += `${verticalAxis--} |`;
            for (let chessPiece of row) {
                boardStr += chessPiece == null ? " . " : ` ${chessPiece.name} `;
            }

            boardStr += "|\n"
        }

        boardStr += horizontalBorder;
        
        boardStr += "   ";
        const horizontalAxisLabels = "ABCDEFGH";
        for (let i = 0; i < this.boardLength; i++){
            boardStr += ` ${horizontalAxisLabels[i]} `;
        } 

        return boardStr;
    }

    public FEN(){
        let fenStr = "";

        for (let row = 0; row < this.boardLength; row++){
            if (row > 0){
                fenStr += "/";
            }
            
            let blankCount = 0;
            for (let chessPiece of this.board[row]) {
                if (chessPiece == null){
                    blankCount++;
                } else {
                    if (blankCount > 0){
                        fenStr += blankCount;
                    }
                    fenStr += chessPiece.name;
                    blankCount = 0;
                }
            }

            if (blankCount > 0){
                fenStr += blankCount;
            }
        }

        fenStr += ` ${ this.turn == Color.White ? "w" : "b" } `;

        return fenStr;
    }
}