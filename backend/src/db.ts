import knex from "knex";

const env = process.env.NODE_ENV || "development";

console.log("db:", env);

const config = require("../knexfile.js");

export const db = knex(config[env] || config.development);

export default db;
