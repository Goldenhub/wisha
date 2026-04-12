/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // Drop existing tables if they exist (in reverse dependency order)
  await knex.schema.dropTableIfExists('confetti_activations');
  await knex.schema.dropTableIfExists('wishes');
  await knex.schema.dropTableIfExists('celebrations');
  await knex.schema.dropTableIfExists('users');
  await knex.schema.dropTableIfExists('sessions');
  
  // Create sessions table
  await knex.schema.createTable('sessions', function(table) {
    table.string('sid').primary();
    table.json('sess').notNullable();
    table.datetime('expired').notNullable();
  });

  // Create users table
  await knex.schema.createTable('users', function(table) {
    table.increments('id').primary();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.datetime('deletedAt').nullable();
    table.datetime('createdAt').defaultTo(knex.fn.now());
  });

  // Create celebrations table
  await knex.schema.createTable('celebrations', function(table) {
    table.increments('id').primary();
    table.string('slug').unique().notNullable();
    table.string('title').notNullable();
    table.string('type').notNullable();
    table.datetime('eventDate').notNullable();
    table.datetime('expiresAt').notNullable();
    table.string('coverImage').nullable();
    table.integer('confettiCount').defaultTo(0);
    table.integer('userId').nullable().references('id').inTable('users').onDelete('CASCADE');
    table.datetime('createdAt').defaultTo(knex.fn.now());
  });

  // Create wishes table
  await knex.schema.createTable('wishes', function(table) {
    table.increments('id').primary();
    table.integer('celebrationId').notNullable().references('id').inTable('celebrations').onDelete('CASCADE');
    table.string('name').nullable();
    table.text('message').notNullable();
    table.string('imageUrl').nullable();
    table.string('visitorId').nullable();
    table.datetime('createdAt').defaultTo(knex.fn.now());
  });

  // Create confetti_activations table
  await knex.schema.createTable('confetti_activations', function(table) {
    table.increments('id').primary();
    table.integer('celebrationId').notNullable().references('id').inTable('celebrations').onDelete('CASCADE');
    table.string('visitorId').notNullable();
    table.datetime('createdAt').defaultTo(knex.fn.now());
  });

  // Create unique index
  await knex.schema.raw('CREATE UNIQUE INDEX confetti_activations_celebration_visitor_unique ON confetti_activations("celebrationId", "visitorId")');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('confetti_activations');
  await knex.schema.dropTableIfExists('wishes');
  await knex.schema.dropTableIfExists('celebrations');
  await knex.schema.dropTableIfExists('users');
  await knex.schema.dropTableIfExists('sessions');
};
