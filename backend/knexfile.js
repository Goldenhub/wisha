const path = require('path');

require('dotenv').config({ 
  path: process.env.NODE_ENV === 'production' 
    ? path.resolve(__dirname, '../.env')
    : path.resolve(__dirname, '.env.local')
});

module.exports = {
  development: {
    client: 'pg',
    connection: {
      connectionString: process.env.PG_CONNECTION_STRING,
      ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './migrations',
      disableTransactions: true
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
      directory: './migrations',
      disableTransactions: true
    }
  }
};
