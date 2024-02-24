const { getGame, updateGame } = require('../base/gamesQuery');

class TicTacToe {
    game = {
        currentTurn: 0,
        symbol: 'X'
    };
    field = Array(9).fill(null);
    players = [
            {
                username: '',
                symbol: "X",
            },
            {
                username: '',
                symbol: "O",
            },
    ];
    winPosition = '';
    winPositions = [
        [0, 1, 2], 
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    isDraw = false;
    isWin = false;

    constructor(io) {
        this.io = io;
    }

    initializeGame(socket) {
        socket.on('games:connect', async(gameProps) => {
            const game = await getGame(gameProps.gameId);

            if (game.finishedAt) {
                socket.emit('games:already-finished', 'Игра уже закончена');
                
                return;
            } else if (game.playerX !== gameProps.playerOne.username || game.playerO !== gameProps.playerTwo.username) {
                socket.emit('games:not-invited', 'Вы не приглашены в эту игру');
                
                return;
            }

            this.createGame(game);
    
            socket.join(`game#${this.game.id}`);
            this.io
                .in(`game#${this.game.id}`)
                .emit('games:connected', 
                {
                    game: this.game,
                    playerX: this.players[0], 
                    playerO: this.players[1]
                });
        });
    }

    async onConnection(socket) {

        socket.on("game:player-move", async ({position, symbol}) => {

            if (!this.checkTurn(this.game.currentTurn, symbol)){
                socket.emit('game:incorrect-move', 'Не ваш ход');
            } else if (!this.isPossibleMove(position)) {
                socket.emit('game:incorrect-move', 'Клетка уже занята');
            } else {
                try {
                    this.makeMove(position, symbol);

                    if (this.checkResult(symbol)) {
                        if (this.isWin) {
                            await updateGame(this.game.id, (((this.game.currentTurn) % 2) + 1))
                            
                            this.io
                                .in(`game#${this.game.id}`)
                                .emit(
                                    'game:finished', 
                                    {
                                        result: 'win',
                                        winner: this.getPlayer((this.game.currentTurn) % 2).username,
                                        symbol,
                                        position, 
                                    }
                                );
                        } else if (this.isDraw) {
                            await updateGame(this.game.id)

                            this.io
                                .in(`game#${this.game.id}`)    
                                .emit(
                                    'game:finished', 
                                    {
                                        result: 'draw',
                                        winner: '',
                                        symbol,
                                        position, 
                                    }
                                );
                        }
                        this.finishGame();

                    } else {
                        this.io
                            .in(`game#${this.game.id}`)
                            .emit(
                                'game:move-made', 
                                {
                                    symbol,
                                    position, 
                                }
                            );

                        this.game.currentTurn++;
                    }
                } catch(e) {
                    console.error(e);
                    return socket.emit('game:error', e);
                }
            }
        });

        socket.on("game-chat:send-message", (message) => {
            if (message.userId && message.text && this.game.id) {
                this.io
                    .in(`game#${this.game.id}`)
                    .emit('game-chat:response-message', message);
            }
        });
    }


    checkResult(symbol) {
        let isWin = true;
        if (this.checkIsWin(symbol, isWin)) {
            return this.isWin;
        }
        
        let isDraw = true
        if (this.checkIsDraw(isDraw)) {
            return this.isDraw;
        }
    }

    checkIsWin(symbol, win) {
        for (const position of this.winPositions) {
            win = true;
    
            for (const cell of position) {
                win = win && this.field[cell] === symbol;
            }

            if (win) {
                this.winPosition = position;
                this.isWin = win;
                return win;
            }
        }
    }

    checkIsDraw(draw) {
        for (let idx = 0; idx < this.field.length; idx++) {
            draw = draw && this.field[idx] !== null;
        }
        this.isDraw = draw
        return draw;
    }

    getSymbol(currentTurn) {
        return currentTurn % 2 ? 'O' : 'X';
    }

    getPlayer(idx) {
        return this.players[idx];
    }

    makeMove(position, symbol) {
        this.field[position] = symbol;
    }

    isPossibleMove(position) {
        return position >= 0 && position < this.field.length && this.field[position] === null;
    }

    checkTurn(currentTurn, symbol) {
        return this.getSymbol(currentTurn) === symbol;
    }

    createGame(game) {
        this.game.id = game.id;
        this.players[0].username = game.playerX;
        this.players[1].username = game.playerO;
        this.players[0].id = game.palyerXid;
        this.players[1].id = game.palyerOid;
        this.players[0].color = true;
        this.players[1].id = false;
    }

    finishGame() {
        this.game = {
            currentTurn: 0,
            symbol: 'X'
        };
        this.field = Array(9).fill(null);
        this.players = [
                {
                    username: '',
                    symbol: "X",
                },
                {
                    username: '',
                    symbol: "O"
                },
        ];
        this.winPosition = '';
        this.isDraw = false;
        this.isWin = false;
    }

    calculateVertAndHorizPositions(number) {
        let num = 0;
        let horizontalPosition = 0;
        let allWinHorizontalPosition = [];
        let allWinVerticalPosition = [];
    
        for(let idx = 0; idx < number; idx++) {
            for(let j = 0; j < number; j++) {
                allWinHorizontalPosition[j] = horizontalPosition + j; // вычисляет выигрышные позиции по горизонтали
                allWinVerticalPosition[j] = number * j + idx; // вычисляет выигрышные позиции по вертикали
            }
            horizontalPosition += number;
    
            for (let idx = 0; idx < 1; idx++) {
                this.winPositions[num] = [];
                this.winPositions[num+number] = [];
                for(let j=0; j < number; j++) {
                    this.winPositions[num][j] = allWinHorizontalPosition[j];
                    this.winPositions[num+number][j] = allWinVerticalPosition[j];
                }
                num++;
            }
        }
    }
    
    calculateLeftDiagonalWinPosition(number) { // вычисляет левую диагональ
        let allWinLeftDiagonalPosition = [0];
        let leftDiagonalPosition = 0;
    
        for (let idx = 0; idx < number-1; idx++) { 
            leftDiagonalPosition += number + 1;
            allWinLeftDiagonalPosition.push(leftDiagonalPosition);
        }
        this.winPositions.splice(0, 0, allWinLeftDiagonalPosition);
    }
    
    calculateRightDiagonalWinPosition(number) { // вычисляет правую диагональ
        let allWinRightDiagonalPosition = [];
        let rightDiagonalPosition = 0;
    
        for (let idx = 0; idx < number; idx++) { 
            rightDiagonalPosition += number - 1;
            allWinRightDiagonalPosition.push(rightDiagonalPosition);
        }
        this.winPositions.splice(0, 0, allWinRightDiagonalPosition);
    }
}

module.exports.TicTacToe = TicTacToe;