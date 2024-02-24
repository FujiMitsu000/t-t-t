import { makeAutoObservable } from 'mobx';

class AdminStore {
    login = '';

    constructor(server, AuthStore, UsersStore) {
        makeAutoObservable(this) 

        this.server = server;
        this.AuthStore = AuthStore;
        this.UsersStore = UsersStore;
    }

    setLogin(text) {
        this.login = text;
    }

    async addUser() {
        await fetch (`${this.server}/api/auth/registration`, {
            method: 'POST',
            body: JSON.stringify(
                {
                    username: this.login,
                    password: '123qwe'
                }
            ),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        this.login = '';
        this.UsersStore.getUsers();
    }

    async setStatus(userId, status) {
        const user = this.UsersStore.users.find(({id}) => id === userId)

        await fetch (`${this.server}/api/players/status`, {
            method: 'PUT',
            body: JSON.stringify(
                {
                    userId: user.id,
                }
            ),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.AuthStore.token}`,
            }
        })

        user.status = status;
        user.updatedAt = new Date().toUTCString();

        this.UsersStore.getUsers();
    }

    unblockUser(userId) {
        this.setStatus(userId, 'active');
    }

    blockUser(userId) {
        this.setStatus(userId, 'deleted');
    }
}   

export default AdminStore;