import { createContext } from "react";
import ActivePlayersStore from "./ActivePlayersStore";
import AdminStore from "./AdminStore";
import AuthStore from "./AuthStore";
import ChatStore from "./ChatStore";
import GameStore from "./GameStore";
import NavbarStore from "./NavbarStore";
import RatingStore from "./RatingStore";
import SocketStore from "./SocketStore";
import UsersStore from "./UsersStore";



export const StoreContext = createContext(null);
export class Store {
    socket;
    server;
    AuthStore;
    UsersStore;
    RatingStore;
    GameStore;
    NavbarStore;
    ChatStore;
    AdminStore;
    ActivePlayersStore;
    SocketStore;

    constructor() {
        this.server = 'http://localhost:8000';

        this.AuthStore = new AuthStore(this.server);
        this.SocketStore = new SocketStore(this.AuthStore);
        this.NavbarStore = new NavbarStore(this.SocketStore);
        this.ActivePlayersStore = new ActivePlayersStore(this.server, this.SocketStore, this.history, this.AuthStore, this.NavbarStore);
        this.UsersStore = new UsersStore(this.server, this.AuthStore);
        this.AdminStore = new AdminStore(this.server, this.AuthStore, this.UsersStore);
        this.RatingStore = new RatingStore(this.server, this.AuthStore);
        this.GameStore = new GameStore(this.SocketStore, this.AuthStore, this.server, this.NavbarStore, this.ActivePlayersStore);
        this.ChatStore = new ChatStore(this.SocketStore, this.AuthStore, this.GameStore);
    }
}