import { reaction, makeAutoObservable, observable, runInAction } from 'mobx';

class AuthStore {
    thisUser = {userId: '', username: '', password: '', status: 'free'};
    token = null;
    Authorized = false;

    displayWarningMsg = false;
    colorWarningMsg = false;
    warningsMessage = '';


    constructor(server) {
        makeAutoObservable(this, {
            Authorized: observable,
            token: observable,
        });

        this.server = server;

        this.token = localStorage.getItem('token');
        this.thisUser.userId = Number(localStorage.getItem('userId'));
        this.thisUser.username = localStorage.getItem('username');
        
        reaction(
            () => this.token,
            (token) => {
                if (token) {
                    localStorage.setItem('token', token);
                    this.Authorized = true;
                } else {
                    this.Authorized = false;
                    localStorage.clear();
                }
            }
        );
    }

    setLogin(text) {
        this.thisUser.username = text;
    }

    setPassword(text) {
        this.thisUser.password = text;
    }

    clearInput() {
        this.thisUser.password = '';
    }

    clearWarning() {
        this.displayWarningMsg = false;
        this.colorWarningMsg = false;
        this.warningsMessage = '';
    }

    async getToken() {
        await fetch (`${this.server}/api/auth/login`, {
            method: 'POST',
            body: JSON.stringify(
                {
                    username: this.thisUser.username,
                    password: this.thisUser.password
                }
            ),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then((data) => {
            if (data[0]?.msg) {
                return (
                    this.displayWarningMsg = true,
                    this.colorWarningMsg = false,
                    this.warningsMessage = data
                )    
            } else {
                this.getUserFromToken(data.token);

                this.clearInput();
                this.clearWarning();
            }
        });
    }

    async registration() {
        await fetch (`${this.server}/api/auth/registration`, {
            method: 'POST',
            body: JSON.stringify(
                {
                    username: this.thisUser.username,
                    password: this.thisUser.password
                }
            ),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then((warning) => {
            if(warning[0]?.msg) {
                return (
                    this.displayWarningMsg = true,
                    this.colorWarningMsg = true,
                    this.warningsMessage = warning
                )
            } else {
                this.displayWarningMsg = true;
                this.colorWarningMsg = false;
                this.warningsMessage = warning.registrationErrors.errors;
            }   
        })
    }

    getUserFromToken(token) {
        if (!token) {
            return this.token = null;
        }

        const [, payload,] = token.split('.');

        if (!payload) {
            return this.token = null;
        }

        try {
            const tokenUser = JSON.parse(window.atob(payload)).sub;
            localStorage.setItem('username', tokenUser.username);
            localStorage.setItem('userId', tokenUser.id);

            this.thisUser.userId = Number(tokenUser.id);
            this.thisUser.username = tokenUser.username;
            this.thisUser.role = tokenUser.userRole;

            this.Authorized = true;
            this.token = token;
            
        } catch (error) {
            this.token = null;
        }
    }

    async isAuthorized() {
        if (!this.token) {
            return;
        }
        await fetch (`${this.server}/api/auth/token`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.token}`,
            },
        })
        .then((response) => response.json())
        .then((response) => {
            if (response.access) {
                runInAction(() => this.Authorized = response.access);
                this.thisUser.role = response.role;
            } else {
                this.token = null;
            }
        })
    }

    checkAccess() {
        if (this.thisUser.role == 'Admin') {
            return true;
        } else {
            return false;
        }
    }

    logout() {
        this.token = null;
        this.thisUser = {};
    }
}

export default AuthStore;