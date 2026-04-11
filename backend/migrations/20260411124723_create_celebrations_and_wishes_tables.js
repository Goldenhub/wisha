/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTableIfNotExists('celebrations', function (table) {
      table.increments('id').primary();
      table.string('slug').unique().notNullable();
      table.string('title').notNullable();
      table.string('type').notNullable();
      table.dateTime('eventDate').notNullable();
      table.dateTime('expiresAt').notNullable();
      table.string('coverImage').nullable();
      table.integer('confettiCount').defaultTo(0);
      table.dateTime('createdAt').defaultTo(knex.fn.now());
    })
    .createTableIfNotExists('wishes', function (table) {
      table.increments('id').primary();
      table.integer('celebrationId').notNullable().references('id').inTable('celebrations').onDelete('CASCADE');
      table.string('name').nullable();
      table.text('message').notNullable();
      table.string('imageUrl').nullable();
      table.dateTime('createdAt').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTable('wishes')
    .dropTable('celebrations');
};
