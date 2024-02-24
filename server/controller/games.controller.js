const knex = require('knex');
const config = require('../configs');

module.exports = {
    getGames: async (req, res) => {
        const db = knex(config.development.database);
        const allGames = await db
            .select({
                id: 'g.id',
                winner: 'g.winner',
                createdAt: 'g.created_at',
                finishedAt: 'g.finished_at',
                playerOne: 'u1.username',
                playerTwo: 'u2.username'
            })
            .from({g: 'games_results'})
            .leftJoin({p1: 'players'}, {'g.id': 'p1.game_id', 'p1.number': 1})
            .leftJoin({u1: 'users'}, {'p1.user_id': 'u1.id'})
            .leftJoin({p2: 'players'}, {'g.id': 'p2.game_id', 'p2.number': 2})
            .leftJoin({u2: 'users'}, {'p2.user_id': 'u2.id'})
            .where({'g.deleted_at': null})
            .whereNotNull('g.finished_at')
            .orderBy('g.finished_at', 'desc')

        const games = allGames.slice(offset, offset + limit);
        const totalCount = allGames.length;

        res.json({ games, totalCount });
    },
    getGame: async (req, res) => {
        const {gameId} = req.params;
        const db = knex(config.development.database);
        const game = await db
            .first({
                id: 'g.id',
                winner: 'g.winner',
                createdAt: 'g.created_at',
                finishedAt: 'g.finished_at',
                playerOne: 'u1.username',
                playerTwo: 'u2.username'
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
        res.json(game);
    },
    createGame: async (req, res) => {
        const db = knex(config.development.database);
        const userIds = req.body;

        if (!userIds || userIds.length !== 2) {
            return res
                .status(400)
                .json({msg: `Проблема с id пользователей`})

        }

        const [{id: gameId}] = await db
            .insert({
                created_at: new Date().toISOString()
            })   
            .into('games_results')
            .returning('id');

        await db    
            .into('players_games')
            .insert({
                    userx: userIds[0],
                    usero: userIds[1],
                    game_id: gameId,
            });
        
        res.json({gameId});
    },
    updateGame: async (req, res) => {
        const {gameId} = req.params;
        const db = knex(config.development.database);

        const {deletedAt} = await db
            .first({deletedAt: 'deleted_at'})
            .from('games_results')
            .where({id: gameId})

        if (deletedAt) {
            res.sendStatus(400);

            return;
        }

        const game = req.body;
        
        await db
        .from('games_results')
        .update({
            'winner': game.winner,
            finished_at: new Date().toISOString()
        })
        .where({id: gameId});
    
    res.sendStatus(200);
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