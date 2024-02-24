const knex = require('knex');
const config = require('../../configs');

module.exports = {
    runSeeds: async() => {
        try {
            const db = knex(config.development.database);
            console.log('seed');
            await db.schema.hasTable('roles').then(async (exists) => {
                if (exists) {
                    return;
                }

                await db
                    .into('roles')
                    .insert([
                        {role: 'User', active: true},
                        {role: 'Admin', active: true},
                ]);
            });
        } catch (e) {
            console.error(e);
        }
    }
}
