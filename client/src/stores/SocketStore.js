import { reaction, makeAutoObservable } from 'mobx';
import { io } from "socket.io-client";


export default class SocketStore {

    socket = io(
        'ws://localhost:8000', 
        {
            auth: 
                {
                    token: localStorage.getItem('token')
                },
            request: {
                    token: this.AuthStore?.token
                }
        },
    );

    constructor(AuthStore) {
        makeAutoObservable(this);

        this.AuthStore = AuthStore;        

        reaction(
            () => this.AuthStore.Authorized,
            (Authorized) => {
                if (Authorized) {
                    this.socket.auth.token = this.AuthStore.token;
                    this.socket.connect();
                } else {
                    this.socket.auth.token = null;
                    this.socket.disconnect();
                }
            }
        );

        this.socket.on('connect_error', (err) => {
            this.socket.auth.token = localStorage.getItem('token');
            setTimeout(() => {
                this.socket.connect();
            }, 2000);
        })
    }
}