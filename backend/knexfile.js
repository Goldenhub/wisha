// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    }
  },

  staging: {
    client: 'pg',
    // connection: {
    //   connectionString: process.env.PG_CONNECTION_STRING,
    //   ssl: { rejectUnauthorized: false },
    // },
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      ssl: { rejectUnauthorized: false },
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'pg',
    // connection: {
    //   connectionString: process.env.PG_CONNECTION_STRING,
    //   ssl: { rejectUnauthorized: false },
    // },
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      ssl: { rejectUnauthorized: false },
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
