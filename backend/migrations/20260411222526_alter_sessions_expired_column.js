/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  try {
    await knex.schema.raw('ALTER TABLE sessions DROP COLUMN expired');
  } catch (e) {
    // Column might not exist or already be TIMESTAMP
  }
  await knex.schema.raw('ALTER TABLE sessions ADD COLUMN expired TIMESTAMP NOT NULL');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  try {
    await knex.schema.raw('ALTER TABLE sessions DROP COLUMN expired');
  } catch (e) {
    // Column might not exist
  }
  await knex.schema.raw('ALTER TABLE sessions ADD COLUMN expired BIGINT NOT NULL');
};
