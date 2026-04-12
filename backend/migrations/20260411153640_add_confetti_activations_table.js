/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable('confetti_activations');
  if (!exists) {
    await knex.schema.createTable('confetti_activations', function (table) {
      table.increments('id').primary();
      table.integer('celebrationId').notNullable().references('id').inTable('celebrations').onDelete('CASCADE');
      table.string('visitorId').notNullable();
      table.dateTime('createdAt').defaultTo(knex.fn.now());
    });
    await knex.schema.raw('CREATE UNIQUE INDEX "confetti_activations_celebration_visitor_unique" ON confetti_activations("celebrationId", "visitorId")');
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('confetti_activations');
};
