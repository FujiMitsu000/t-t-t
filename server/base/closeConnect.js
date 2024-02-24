const knex = require('knex');
const config = require('../configs');

module.exports = {
    closeIdleConnections: async () => {
        const db = knex(config.development.database);

        await db
        .select( db.raw('pg_terminate_backend(pid)'))
        .from('pg_stat_activity')
        .where({'datname': config.development.database.connection.database})
        .andWhere({'state': 'idle'})
        .andWhere({'application_name': ''})
    }
}
