import { makeAutoObservable, runInAction } from 'mobx';
import { setPages } from '../utils/pageCounter';

export default class GameStore {
    users = [];
    pages = [];
    activePage = 1;

    constructor(server, AuthStore) {
        makeAutoObservable(this);

        this.server = server;
        this.AuthStore = AuthStore;
    }

    async getUsers(limit = 10, offset = 0) {
        await fetch (`${this.server}/api/players?limit=${limit}&offset=${offset}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.AuthStore.token}`,
            },
        })
        .then((response) => response.json())
        .then((response) => {
            runInAction(() => this.users = response.users);

            this.pages = setPages(response.totalCount, limit);
        });
    }
    
    togglePage(page) {
        this.activePage = page;
    }
}