import knex from 'knex';

const testDb = knex({
  client: 'sqlite3',
  connection: {
    filename: ':memory:',
  },
  useNullAsDefault: true,
});

beforeAll(async () => {
  await testDb.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.dateTime('createdAt').defaultTo(testDb.fn.now());
  });

  await testDb.schema.createTable('celebrations', (table) => {
    table.increments('id').primary();
    table.string('slug').unique().notNullable();
    table.string('title').notNullable();
    table.string('type').notNullable();
    table.dateTime('eventDate').notNullable();
    table.dateTime('expiresAt').notNullable();
    table.string('coverImage').nullable();
    table.integer('confettiCount').defaultTo(0);
    table.integer('userId').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.dateTime('createdAt').defaultTo(testDb.fn.now());
  });

  await testDb.schema.createTable('wishes', (table) => {
    table.increments('id').primary();
    table.integer('celebrationId').notNullable().references('id').inTable('celebrations').onDelete('CASCADE');
    table.string('name').nullable();
    table.text('message').notNullable();
    table.string('imageUrl').nullable();
    table.dateTime('createdAt').defaultTo(testDb.fn.now());
  });

  await testDb.schema.createTable('sessions', (table) => {
    table.string('sid').primary();
    table.json('sess').notNullable();
    table.bigInteger('expired').unsigned().notNullable();
  });

  await testDb.schema.createTable('confetti_activations', (table) => {
    table.increments('id').primary();
    table.integer('celebrationId').notNullable().references('id').inTable('celebrations').onDelete('CASCADE');
    table.string('visitorId').notNullable();
    table.dateTime('createdAt').defaultTo(testDb.fn.now());
  });
});

afterAll(async () => {
  await testDb.destroy();
});

export { testDb };
