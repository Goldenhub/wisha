/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable('celebrations');
  if (!exists) {
    await knex.schema.createTable('celebrations', function (table) {
      table.increments('id').primary();
      table.string('slug').unique().notNullable();
      table.string('title').notNullable();
      table.string('type').notNullable();
      table.dateTime('eventDate').notNullable();
      table.dateTime('expiresAt').notNullable();
      table.string('coverImage').nullable();
      table.integer('confettiCount').defaultTo(0);
      table.dateTime('createdAt').defaultTo(knex.fn.now());
    });
  }
  
  const wishesExists = await knex.schema.hasTable('wishes');
  if (!wishesExists) {
    await knex.schema.createTable('wishes', function (table) {
      table.increments('id').primary();
      table.integer('celebrationId').notNullable().references('id').inTable('celebrations').onDelete('CASCADE');
      table.string('name').nullable();
      table.text('message').notNullable();
      table.string('imageUrl').nullable();
      table.dateTime('createdAt').defaultTo(knex.fn.now());
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('wishes');
  await knex.schema.dropTableIfExists('celebrations');
};
