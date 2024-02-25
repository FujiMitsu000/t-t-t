import { makeAutoObservable } from 'mobx';

class AdminStore {
    login = '';
    msg = '';

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

    async makeMeAdmin() {
        await fetch (`${this.server}/api/auth/role`, {
            method: 'PUT',
            body: JSON.stringify(
                {
                    userId: this.AuthStore.thisUser.userId
                }
            ),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then((response) => response.json())
        .then((response) => {
            if (response) {
                this.AuthStore.getUserFromToken(response.token);
                this.msg = 'Успешно!';

                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                this.msg = 'Вы уже админ';
            }
        })
    }
}   

export default AdminStore;