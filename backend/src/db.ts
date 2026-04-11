import knex from "knex";
import dotenv from "dotenv";

dotenv.config();

const config = require("../knexfile.js");
const environment = process.env.NODE_ENV || "development";

export const db = knex(config[environment] || config.development);

export default db;
