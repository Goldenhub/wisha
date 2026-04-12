import knex from "knex";
import dotenv from "dotenv";

dotenv.config();

const env = process.env.NODE_ENV || "development";
const config = require("../knexfile.js");

export const db = knex(config[env] || config.development);

export default db;
