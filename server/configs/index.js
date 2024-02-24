module.exports = {
    development: {
        server: {
            port: 8000
        },
        database: {        
            client: 'postgresql',
            connection: {
                database: process?.env.POSTGRES_DB ||  't_t_t',
                user: process?.env.POSTGRES_USER || 'postgres',
                password: process?.env.POSTGRES_PASSWORD || '12345',
                host: process?.env.POSTGRES_HOST || 'localhost',
                port: 5432,
            },
            migrations: {
                tableName: 'migrations',
                directory: './db/migrations'
            },
            seeds: {
                directory: './db/seeds'
            }
        }
    }
};
