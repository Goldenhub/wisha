import knex from "knex";
import dotenv from "dotenv";
import path from "path";

const env = process.env.NODE_ENV || "development";
const isProduction = env === "production";

if (isProduction) {
  dotenv.config({ path: path.resolve(__dirname, "../.env") });
} else {
  dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
}

const config = require("../knexfile.js");

export const db = knex(config[env] || config.development);

export default db;
