import { makeAutoObservable } from 'mobx';

export default class NavbarStore {
    activeMenu = false;
    isVisibleModal = false;
    activeModal = '';
    textModal = '';

    constructor(socket) {
        makeAutoObservable(this);

        this.socket = socket;
    }

    changeActive() {
        this.activeMenu = !this.activeMenu;
    }

    displayModal(isModal, text = '') {
        if (!this.isVisibleModal) {
            if (isModal === 'invitation') {
                this.activeModal = 'invitation';
            } else if (isModal === 'gameInfo') {
                this.activeModal = 'gameInfo';
            } else if (isModal === 'addUser') {
                this.activeModal = 'addUser';
            }
        }
        
        this.textModal = text;
        this.isVisibleModal = true;
    }

    closeModalWindow() {
        this.isVisibleModal = false;
        this.textModal = '';
        this.activeModal = '';
    }
}