import { reaction, makeAutoObservable, runInAction } from 'mobx';


class ActivePlayersStore {
    activePlayers = [];
    activePage = 1;
    players = null;
    awaitTimeout = null;
    error = false;
    pages = [];
    pagePlayers = [];

    constructor (server, socket, history, AuthStore, NavbarStore) {
        makeAutoObservable(this) 

        this.AuthStore = AuthStore;
        this.NavbarStore = NavbarStore;
        this.server = server;
        this.socket = socket.socket;
        this.history = history;

        reaction(
            () => this.AuthStore.Authorized,
            (Authorized) => {
                if (!Authorized) {
                    this.activePlayers = [];
                } 
            }
        );

        this.socket.on('players:invited', players => {
            this.players = players;
            this.NavbarStore.displayModal('invitation', players[0].username);

            runInAction(() => {
                this.awaitTimeout = setTimeout(() => {
                    this.awaitTimeout = null;
                    this.NavbarStore.closeModalWindow();
                }, 15000);
            })
        });

        this.socket.on('players:accepted', (gameProps) => {
            window.history.pushState("", "", `/game/${gameProps.gameId}`);
            
            if (gameProps.playerOne.userId === this.AuthStore.thisUser?.userId) {
                this.NavbarStore.displayModal('gameInfo', 'Начать игру');
                clearTimeout(this.awaitTimeout);
            }
            
            this.socket.emit('games:connect', gameProps);
        });

        for (const event of ['players:unavailable', 'players:cancelled', 'players:declined']) {
            this.socket.on(event, (info) => {
                if (info.playerOne.userId === this.AuthStore.thisUser?.userId) {
                    this.dispalyError();
                    this.NavbarStore.displayModal('gameInfo', info.msg);
                    clearTimeout(this.awaitTimeout);
                } else {
                    this.NavbarStore.closeModalWindow();
                }
            });
        }

        this.socket.on('players:list-active-players', listActivePlayers => {
            this.setActivePlayers(listActivePlayers);
        })
    }

    invitePlayer(userId, status) {
        if (status) {
            this.socket.emit('players:invite', 
                [this.AuthStore.thisUser.userId, userId]
            );
        }
        
        runInAction(() => {
            this.awaitTimeout = setTimeout(
                () => {
                    this.socket.emit('players:cancel', [this.AuthStore.thisUser.userId, userId]);
                    this.awaitTimeout = null
                },
                15000
            );
        })
        
    }

    acceptInvite() {
        this.socket.emit('players:accept', this.players);

        clearTimeout(this.awaitTimeout);
        this.NavbarStore.closeModalWindow();
    }
    
    declineInvite() {
        this.socket.emit('players:decline', this.players);

        clearTimeout(this.awaitTimeout);
        this.NavbarStore.closeModalWindow();
    }

    findUser(id) {
        return this.activePlayers.findIndex(user => user.userId === id)
    }

    setActivePlayers(listActivePlayers) {
        if (this.AuthStore.thisUser) {
            runInAction(() => {
                this.activePlayers = listActivePlayers.filter(({userId}) => userId != this.AuthStore.thisUser?.userId);
            })
        } else {
            this.activePlayers = [];
        }
    }

    nextPage(start, end) {
        this.pagePlayers = this.activePlayers.slice(start, end);
    }

    togglePage(page) {
        this.activePage = page;
    }

    dispalyError() {
        this.error = !this.error;
    }
}   

export default ActivePlayersStore;