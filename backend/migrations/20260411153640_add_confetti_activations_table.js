/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists('confetti_activations', function (table) {
    table.increments('id').primary();
    table.integer('celebrationId').notNullable().references('id').inTable('celebrations').onDelete('CASCADE');
    table.string('visitorId').notNullable();
    table.dateTime('createdAt').defaultTo(knex.fn.now());
    table.unique(['celebrationId', 'visitorId']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('confetti_activations');
};
