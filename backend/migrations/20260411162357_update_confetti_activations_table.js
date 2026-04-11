/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('confetti_activations', function(table) {
    table.integer('userId').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.dropUnique(['celebrationId', 'visitorId']);
    table.unique(['userId', 'visitorId']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('confetti_activations', function(table) {
    table.dropUnique(['userId', 'visitorId']);
    table.dropColumn('userId');
    table.unique(['celebrationId', 'visitorId']);
  });
};
