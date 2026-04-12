/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const hasColumn = await knex.schema.hasColumn('wishes', 'visitorId');
  if (!hasColumn) {
    await knex.schema.raw('ALTER TABLE wishes ADD COLUMN "visitorId" TEXT');
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  const hasColumn = await knex.schema.hasColumn('wishes', 'visitorId');
  if (hasColumn) {
    await knex.schema.raw('ALTER TABLE wishes DROP COLUMN "visitorId"');
  }
};
