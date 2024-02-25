const knex = require('knex');
const config = require('../../configs');

module.exports = {
        createTables: async() => {
                try {
                        const db = knex(config.development.database);
                        await db.schema.hasTable('users').then(async (exists) => {
                                if (!exists) {
                                console.log('tables created');
                                await db.schema
                                        .createTable('users', (table) => {
                                table
                                        .increments('id')
                                        .comment('Идентификатор');
                                table
                                        .string('username', 255)
                                        .notNullable()
                                        .unique()
                                        .comment('Имя пользователя');
                                table
                                        .string('password', 255)
                                        .notNullable()
                                        .comment('Пароль');
                                table
                                        .string('status', 64)
                                        .notNullable()
                                        .defaultTo('active')
                                        .comment('Статус');
                                table
                                        .datetime('created_at', {useTz: false})
                                        .notNullable()
                                        .defaultTo(db.fn.now())
                                        .comment('Дата создания');
                                table
                                        .timestamp('updated_at', {useTz: false})
                                        .nullable()
                                        .comment('Дата обновления');
                                table.comment('Пользователи');
                                });
                                await db.schema
                                        .createTable('games_results', (table) => {
                                table
                                        .increments('id')
                                        .comment('Идентификатор');
                                table
                                        .integer('winner')
                                        .nullable()
                                        .comment('Номер победившего игрока');
                                table
                                        .timestamp('created_at', {useTz: false})
                                        .notNullable()
                                        .defaultTo(db.fn.now())
                                        .comment('Дата создания');
                                table
                                        .timestamp('finished_at', {useTz: false})
                                        .nullable()
                                        .comment('Дата окончания');
                                table
                                        .timestamp('deleted_at', {useTz: false})
                                        .nullable()
                                        .comment('Дата удаления');
                                table.comment('Игры');
                                })
                                await db.schema
                                        .createTable('players', (table) => {
                                table
                                        .integer('user_id')
                                        .notNullable()
                                        .references('id')
                                        .inTable('users')
                                        .comment('Игроки');
                                table
                                        .integer('game_id')
                                        .notNullable()
                                        .references('id')
                                        .inTable('games_results')
                                        .comment('Идентификатор игры');
                                table
                                        .integer('number')
                                        .notNullable()
                                        .comment('Номер игрока');
                                table
                                        .comment('Игроки в сыгранных играх');
                                });
                                await db.schema
                                        .createTable('roles', (table) => {
                                table
                                        .increments('id')
                                        .comment('Идентификатор');
                                table
                                        .string('role', 255)
                                        .notNullable().unique()
                                        .comment('Роль');
                                table
                                        .boolean('active')
                                        .notNullable();
                                table
                                        .timestamp('created_at', {useTz: false})
                                        .notNullable()
                                        .defaultTo(db.fn.now())
                                        .comment('Дата создания');
                                });
                                await db.schema
                                .createTable('assigned_roles', (table) => {
                                table
                                        .increments('id')
                                        .comment('Идентификатор');
                                table
                                        .integer('user_id')
                                        .notNullable()
                                        .references('id')
                                        .inTable('users');
                                table
                                        .integer('role_id')
                                        .notNullable()
                                        .references('id')
                                        .inTable('roles');
                                });
                                }   
                        });
                } catch (e) {
                        console.error(e);
                }
        } 
}