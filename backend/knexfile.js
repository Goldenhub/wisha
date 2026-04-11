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
    connection: process.env.PG_CONNECTION_STRING,
    // connection: {
    //   host: process.env.DB_HOST,
    //   database: process.env.DATABASE,
    //   user: process.env.USER,
    //   password: process.env.PASSWORD
    // },
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
    connection: process.env.PG_CONNECTION_STRING,
    // connection: {
    //   host: process.env.DB_HOST,
    //   database: process.env.DATABASE,
    //   user: process.env.USER,
    //   password: process.env.PASSWORD
    // },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
