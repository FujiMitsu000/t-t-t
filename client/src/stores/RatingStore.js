import { makeAutoObservable, runInAction } from 'mobx';


export default class RatingStore {
    ratings = [];

    constructor(server, AuthStore) {
        makeAutoObservable(this);

        this.server = server;
        this.AuthStore = AuthStore;
    }

    async getStatistics() {
        if (!this.ratings?.length) {
            await fetch (`${this.server}/api/statistics`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.AuthStore.token}`
                }
            })
            .then((stats) => stats.json())
            .then((stats) => {
                runInAction(() => this.ratings = stats);
            });
        }
        
    }


}
