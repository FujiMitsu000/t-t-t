const knex = require('knex');
const config = require('../configs');

function getTotalGames(statistics) {

    statistics.map((player) => {
        player.total = (player.wins + player.loses + player.draws);
    })

    return statistics;
}

module.exports = {
    getStatistics: async (req, res) => {
        const limit = Number(req.query.limit) || 10;
        const offset = Number(req.query.offset) || 0;

        const db = knex(config.development.database);
        const statistics = await db
            .select({
                id: 'u.id',
                username: db.raw('max(username)'),
                wins: db.raw(`count(g.winner = p.number or null)::integer`),
                loses: db.raw('count(g.winner <> p.number or null)::integer'),
                draws: db.raw('count(g.id is not null and g.winner is null or null)::integer'),
            })
            .from({u: 'users'})
            .leftJoin({p: 'players'}, {'u.id': 'p.user_id'})
            .leftJoin({g: 'games_results'}, {'p.game_id': 'g.id'})
            .groupBy('u.id')
            .orderBy('wins', 'desc')
            .limit(limit)
            .offset(offset);
            
        res.json(getTotalGames(statistics));
    },
    getPlayerStatistics: async (req, res) => {
        const db = knex(config.development.database);
        const {userId} = req.params;

        const statistics =  await db
            .select({
                id: 'u.id',
                username: db.raw('max(username)'),
                // total: db.raw('(wins + loses + draws)::integer'),
                wins: db.raw(`count(g.winner = p.number or null)::integer`),
                loses: db.raw('count(g.winner <> p.number or null)::integer'),
                draws: db.raw('count(g.id is not null and g.winner is null or null)::integer')
            })
            .from({u: 'users'})
            .leftJoin({p: 'players'}, {'u.id': 'p.user_id'})
            .leftJoin({g: 'games_results'}, {'p.game_id': 'g.id'})
            .where('u.id', userId)
            .groupBy('u.id');
        
        res.json(statistics);
    }
};
