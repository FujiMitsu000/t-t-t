const knex = require('knex');
const config = require('../../configs');

module.exports = {
    runSeeds: async() => {
        try {
            const db = knex(config.development.database);
            
            await db.schema.hasTable('roles').then(async (exists) => {
                if (!exists) {
                    return console.error('seeds not created, something went wrong');
                }

                let [role] = await db
                    .into('roles')
                    .select('role')

                if (role) {
                    return;
                }

                console.log('seeds created');

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
