/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('sessions', function(table) {
    table.dropColumn('expired');
    table.datetime('expired').notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('sessions', function(table) {
    table.dropColumn('expired');
    table.bigInteger('expired').unsigned().notNullable();
  });
};
