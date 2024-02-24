async function getPlayersList(io) {
    let onlinePlayers = 
        Array.from(await io.fetchSockets())
            .map((anotherSocket) => ({
                userId: anotherSocket.data.userId,
                username: anotherSocket.data.username,
                status: !Array.from(anotherSocket.operator?.rooms || anotherSocket.rooms)
                .some((key) => Boolean(key.match(/game#\d+/))),
                socketId: anotherSocket.id
            }))

    return onlinePlayers;
}

module.exports = { getPlayersList };