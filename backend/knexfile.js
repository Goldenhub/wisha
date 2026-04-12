require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING || 'postgresql://localhost:5432/weesha',
    ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false,
    migrations: {
      directory: './migrations'
    }
  },

  production: {
    client: 'pg',
    connection: {
      connectionString: process.env.PG_CONNECTION_STRING,
      ssl: { rejectUnauthorized: false },
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './migrations'
    }
  }
};
