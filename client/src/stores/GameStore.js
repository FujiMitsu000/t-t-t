import { makeAutoObservable, runInAction } from 'mobx';
import { setPages } from '../utils/pageCounter';

export default class GameStore {
    game = {};
    field = Array(9).fill(null);
    currentFieldPosition = '';
    finished = false;
    games = [];
    pages = [];
    activePage = 1;

    constructor(socket, AuthStore, server, NavbarStore, ActivePlayersStore) {
        makeAutoObservable(this);

        this.server = server; 
        this.socket = socket.socket;
        this.AuthStore = AuthStore;
        this.NavbarStore = NavbarStore;
        this.ActivePlayersStore = ActivePlayersStore;

        this.socket.on('games:connected', (gameInfo) => {
            this.startGame(gameInfo);
        });
        this.socket.on('game:move-made', ({symbol, position}) => {
                this.setSymbol(position, symbol);
                this.changeSymbol(symbol);
                this.changeColor();
        });
        this.socket.on('game:finished', ({result, winner, symbol, position}) => {
            this.setSymbol(position, symbol);
            this.changeSymbol(symbol);
            this.changeColor(result, winner);

            this.showGameResult(result, winner);
            this.socket.emit('leave-room', this.game.id);
        });

        this.socket.on('game:incorrect-move', err => {this.NavbarStore.displayModal('gameInfo', err);})
        this.socket.on('game:error', err => this.NavbarStore.displayModal('gameInfo', err));
        this.socket.on('games:already-finished', err => {this.NavbarStore.displayModal('gameInfo', err);});
        this.socket.on('games:not-invited', err => {this.NavbarStore.displayModal('gameInfo', err);});

        for (const event of ['game:incorrect-move', 'game:error', 'games:already-finished', 'games:not-invited']) {
            this.socket.on(event, err => {
                this.ActivePlayersStore.dispalyError();
                this.NavbarStore.displayModal('gameInfo', err);
            });
        }
    }

    startGame(game) {
        this.game = {...game.game, result: ''};
        if(this.AuthStore.thisUser.username === game.playerX.username) {
            this.game.thisPlayer = game.playerX;
            this.game.secondPlayer = game.playerO;
        } else {
            this.game.secondPlayer = game.playerX;
            this.game.thisPlayer = game.playerO;
        }
    }

    finishGame() {
        this.game = {currentTurn: 0, symbol: '', result: ''};
        this.currentFieldPosition = '';
        this.field = Array(9).fill(null);
        this.finished = false;
    }

    makeMove(e, gameFieldRef) {
        if (this.game.id) {
            this.checkCells(e.target, gameFieldRef.current.children);
            this.sendMove(this.currentFieldPosition);
        } 
    }

    checkCells(cell, cells) {
        for (let idx = 0; idx < cells.length; idx++) {
            if (cell === cells[idx]){
                this.currentFieldPosition = idx;
                break;
            }
        }
    }

    sendMove(position){
        this.socket.emit("game:player-move", {
            position, 
            symbol: this.game.thisPlayer.symbol,
        });
    }

    setSymbol(position, symbol) {
        this.field[position] = symbol;
    }

    changeSymbol(symbol) {
        this.game.symbol = symbol === 'X' ? 'O' : 'X';
    }

    changeColor(result = '', winner = '') {
        if (result) {
            if (result === 'win') {
                if (this.game.thisPlayer.username === winner) {
                    this.game.thisPlayer.color = result;
                } else {
                    this.game.secondPlayer.color = result;
                }
            } else if (result === 'draw') {
                this.game.thisPlayer.color = result;
                this.game.secondPlayer.color = result;
            }
        } else {
            this.game.thisPlayer.color = !this.game.thisPlayer.color;
            this.game.secondPlayer.color = !this.game.secondPlayer.color;
        }
    }

    showGameResult(result, winner) {
        let text = '';

        if (result === 'win') {
            text = `Победил ${winner}`
        } else if (result === 'draw') {
            text = 'Ничья!';
        }
        this.finished = true;

        this.NavbarStore.displayModal('gameInfo', text);
    }

    async getGames(limit = 10, offset = 0) {
        await fetch(`${this.server}/api/games?limit=${limit}&offset=${offset}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.AuthStore.token}`,
            },
        })
        .then((response) => response.json())
        .then((response) => {
            runInAction(() => {
                this.games = response.games;
                this.pages = setPages(response.totalCount, limit);
            });
        });
    }

    togglePage(page) {
        this.activePage = page;
    }
}