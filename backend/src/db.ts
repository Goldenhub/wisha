import knex from "knex";

const config: Record<string, object> = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./dev.sqlite3",
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./migrations",
    },
  },
};

const environment = process.env.NODE_ENV || "development";
export const db = knex(config[environment] || config.development);

export default db;
