import { makeAutoObservable } from 'mobx';

export default class ChatStore {
    messages = [];

    constructor(socket, AuthStore, GameStore) {
        makeAutoObservable(this);
        
        this.socket = socket.socket;
        this.AuthStore = AuthStore;
        this.GameStore = GameStore;

        this.socket.on('game-chat:response-message', responseMsg => {
            this.setMessage(responseMsg);
        });
    }

    handleSendMessage = (input, gameId) => {
        if (gameId) {
            this.sendMessage({userId: this.AuthStore.thisUser.userId, text: input.current.value})
        } 
    }

    sendMessage({ userId, text }) {
        if (userId && text) {
            this.socket.emit("game-chat:send-message", { userId, text });
        }
    }

    setMessage(responseMsg) {
        this.messages.push({id: Date.now(), userId: responseMsg.userId, text: responseMsg.text})
    }

    clearChat() {
        this.messages = [];
    }
}
