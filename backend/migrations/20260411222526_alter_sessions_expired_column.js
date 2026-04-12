/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const hasTable = await knex.schema.hasTable('sessions');
  if (!hasTable) return;
  
  try {
    await knex.schema.raw('ALTER TABLE sessions DROP COLUMN expired');
  } catch (e) {}
  await knex.schema.raw('ALTER TABLE sessions ADD COLUMN expired TIMESTAMP NOT NULL');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  const hasTable = await knex.schema.hasTable('sessions');
  if (!hasTable) return;
  
  try {
    await knex.schema.raw('ALTER TABLE sessions DROP COLUMN expired');
  } catch (e) {}
  await knex.schema.raw('ALTER TABLE sessions ADD COLUMN expired BIGINT NOT NULL');
};
