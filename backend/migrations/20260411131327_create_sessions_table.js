/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable('sessions');
  if (!exists) {
    await knex.schema.createTable('sessions', function (table) {
      table.string('sid').primary();
      table.json('sess').notNullable();
      table.datetime('expired').notNullable();
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('sessions');
};
