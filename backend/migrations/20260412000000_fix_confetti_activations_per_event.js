/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const isPostgres = knex.client.driverName === 'pg';
  
  if (isPostgres) {
    // Check if already migrated
    const columns = await knex.schema.raw(`SELECT column_name FROM information_schema.columns WHERE table_name = 'confetti_activations'`);
    const columnNames = columns.rows.map(r => r.column_name);
    
    // Drop old index if exists
    try {
      await knex.schema.raw('DROP INDEX IF EXISTS "confetti_activations_user_id_visitor_id_unique"');
    } catch (e) {}
    
    // Add celebrationId if not exists
    if (!columnNames.includes('celebrationId')) {
      await knex.schema.raw('ALTER TABLE confetti_activations ADD COLUMN "celebrationId" INTEGER REFERENCES celebrations(id) ON DELETE CASCADE');
    }
    
    // Update celebrationId from celebrationId column (self-reference in case of partial run)
    try {
      await knex.schema.raw('UPDATE confetti_activations SET "celebrationId" = "celebrationId"');
    } catch (e) {}
    
    // Make NOT NULL
    try {
      await knex.schema.raw('ALTER TABLE confetti_activations ALTER COLUMN "celebrationId" SET NOT NULL');
    } catch (e) {}
    
    // Drop userId if exists
    if (columnNames.includes('userId')) {
      try {
        await knex.schema.raw('ALTER TABLE confetti_activations DROP COLUMN IF EXISTS "userId"');
      } catch (e) {}
    }
    
    // Create unique index
    await knex.schema.raw('DROP INDEX IF EXISTS "confetti_activations_celebration_visitor_unique"');
    await knex.schema.raw('CREATE UNIQUE INDEX "confetti_activations_celebration_visitor_unique" ON confetti_activations("celebrationId", "visitorId")');
  } else {
    // SQLite: recreate table with new schema
    await knex.schema.raw('DROP TABLE IF EXISTS confetti_activations_new');
    await knex.schema.raw(`
      CREATE TABLE confetti_activations_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        celebrationId INTEGER NOT NULL REFERENCES celebrations(id) ON DELETE CASCADE,
        visitorId TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(celebrationId, visitorId)
      )
    `);
    await knex.schema.raw(`
      INSERT INTO confetti_activations_new (celebrationId, visitorId, createdAt)
      SELECT celebrationId, visitorId, createdAt FROM confetti_activations
    `);
    await knex.schema.raw('DROP TABLE confetti_activations');
    await knex.schema.raw('ALTER TABLE confetti_activations_new RENAME TO confetti_activations');
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  const isPostgres = knex.client.driverName === 'pg';
  
  if (isPostgres) {
    await knex.schema.raw('DROP INDEX IF EXISTS "confetti_activations_celebration_visitor_unique"');
    await knex.schema.raw('ALTER TABLE confetti_activations DROP COLUMN IF EXISTS "celebrationId"');
    await knex.schema.raw('ALTER TABLE confetti_activations ADD COLUMN "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE');
    await knex.schema.raw('CREATE UNIQUE INDEX "confetti_activations_user_visitor_unique" ON confetti_activations("userId", "visitorId")');
  }
};
