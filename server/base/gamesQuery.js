const knex = require('knex');
const config = require('../configs');

module.exports = {
    getGame: async (gameId) => {
        const db = knex(config.development.database);
        const game = await db
            .first({
                id: 'g.id',
                winner: 'g.winner',
                createdAt: 'g.created_at',
                finishedAt: 'g.finished_at',
                playerXid: 'u1.id',
                playerX: 'u1.username',
                playerOid: 'u2.id',
                playerO: 'u2.username'
            })
            .from({g: 'games_results'})
            .leftJoin({p1: 'players'}, {'g.id': 'p1.game_id', 'p1.number': 1})
            .leftJoin({u1: 'users'}, {'p1.user_id': 'u1.id'})
            .leftJoin({p2: 'players'}, {'g.id': 'p2.game_id', 'p2.number': 2})
            .leftJoin({u2: 'users'}, {'p2.user_id': 'u2.id'})
            .where({'g.id': gameId, 'g.deleted_at': null});

            if (!game) {
                return res
                    .status(400)
                    .json({msg: `Игра не надйена`});
            }

        return game;
    },
    createGame: async (userIds) => {
        const db = knex(config.development.database);
        const [{id: gameId}] = await db
            .insert({
                created_at: new Date().toISOString()
            })   
            .into('games_results')
            .returning('id');

        await db    
            .into('players')
            .insert(
                userIds.map(
                    (userId, idx) => ({
                        user_id: userId,
                        game_id: gameId,
                        number: idx + 1
                    })
                )
            );
        
        return gameId;
    },
    updateGame: async (gameId, winner = null) => {
        const db = knex(config.development.database);
        const {deletedAt} = await db
            .first({deletedAt: 'deleted_at'})
            .from('games_results')
            .where({id: gameId})
        
        if (deletedAt) {
            return; 
        }
        
        await db
        .from('games_results')
        .update({
            winner,
            finished_at: new Date().toISOString()
        })
        .where({id: gameId});
    },
    deleteGame: async (req, res) => {
        const {gameId} = req.params;
        const db = knex(config.development.database);

        const {finishedAt} = await db
            .first({finishedAt: 'finished_at'})
            .from('games_results')
            .where({id: gameId})

        if (finishedAt) {
            return res
            .status(400)
            .json({msg: `Игра уже закончена`});
        }

        await db
            .from('games_results')
            .update({
                deleted_at: new Date().toISOString()
            })
            .where({id: gameId})
        
        res.sendStatus(200);
    }
};