/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.raw('ALTER TABLE sessions DROP COLUMN IF EXISTS expired');
  await knex.schema.raw('ALTER TABLE sessions ADD COLUMN expired TIMESTAMP NOT NULL');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.raw('ALTER TABLE sessions DROP COLUMN IF EXISTS expired');
  await knex.schema.raw('ALTER TABLE sessions ADD COLUMN expired BIGINT NOT NULL');
};
