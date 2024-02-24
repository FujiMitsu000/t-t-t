const { TicTacToe } = require('./gameLogic/Tic Tac Toe.js');
const { createGame } = require('./base/gamesQuery');
const socketAuthMiddleware = require('./middlewares/socketAuthMiddleware.js');
const { getPlayersList } = require('./utils/getListActivePlayers.js');
const { verifyToken } = require('./utils/verifyToken');



module.exports = (io) => {
    let onlinePlayers = [];
    const game = new TicTacToe(io);

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        
        if (socketAuthMiddleware(token)) {
            next();
        } else {
            const err = new Error("not authorized");
            next(err);
        }
    });

    io.on('connect', async (socket) => {
        let payload = verifyToken(socket.handshake.auth.token);

        socket.data.username = payload.sub.username;
        socket.data.userId = payload.sub.id;

        let interval = setInterval(
            async () => {
                if (socket.data.username) {
                    onlinePlayers = await getPlayersList(io);

                    socket.broadcast.emit(
                        'players:list-active-players',
                        onlinePlayers
                    );
                }
            },
            2000
        );

        socket.on(
            'players:invite',
            (ids) => {
                const playerOne = onlinePlayers[findUser(ids[0])];
                const playerTwo = onlinePlayers[findUser(ids[1])];

                if (playerOne && playerTwo && playerTwo.status) {
                    io
                    .to(playerTwo.socketId)
                    .emit('players:invited', [playerOne, playerTwo]);
                } else {
                    socket.emit('players:unavailable');
                }
            }
        );

        socket.on(
            'players:accept',
            async ([playerOne, playerTwo]) => {
                
                const gameId = await createGame([playerOne.userId, playerTwo.userId]);

                io
                    .to([playerOne.socketId, playerTwo.socketId])
                    .emit('players:accepted', {playerOne, playerTwo, gameId});
            }
        );

        socket.on(
            'players:cancel', 
            (ids) => {
                const playerOne = onlinePlayers[findUser(ids[0])];
                const playerTwo = onlinePlayers[findUser(ids[1])];

            if (playerOne && playerTwo && playerTwo.status) {
                io
                    .to([playerOne.socketId, playerTwo.socketId])
                    .emit('players:cancelled', {msg: 'Игрок не ответил', playerOne: playerOne, playerTwo: playerTwo});
            } else {
                socket.emit('players:unavailable');
            }
        })

        socket.on(
            'players:decline',
            (players) => {
                io
                .to([players[0].socketId, players[1].socketId])
                .emit('players:cancelled', {msg: 'Игрок отказался', playerOne: players[0], playerTwo: players[1]});
            }
        );

        socket.on(
            'players:unavailable', 
            (ids) => {
                const playerOne = onlinePlayers[findUser(ids[0])];
                const playerTwo = onlinePlayers[findUser(ids[1])];

            if (playerOne && playerTwo && playerTwo.status) {
                io
                    .to([playerOne.socketId, playerTwo.socketId])
                    .emit('players:cancelled', {from: fromPlayer, to: toPlayer});
            } else {
                socket.emit('players:unavailable');
            }
        })


        game.initializeGame(socket, io);
        game.onConnection(socket);


        socket.on('leave-room', (gameId) => {
            socket
                .in(`game#${gameId}`)
                .socketsLeave(`game#${gameId}`);
        })

        socket.on('disconnect', async () => {

            clearInterval(interval);

            onlinePlayers = await getPlayersList(io);
            socket.broadcast.emit('players:list-active-players', onlinePlayers);
        });
    });


    function findUser(id) {
        return onlinePlayers.findIndex(user => user.userId === id)
    }
};