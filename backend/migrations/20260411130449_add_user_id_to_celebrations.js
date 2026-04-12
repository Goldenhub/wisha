/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const hasColumn = await knex.schema.hasColumn('celebrations', 'userId');
  if (!hasColumn) {
    await knex.schema.raw('ALTER TABLE celebrations ADD COLUMN "userId" INTEGER REFERENCES users(id) ON DELETE CASCADE');
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  const hasColumn = await knex.schema.hasColumn('celebrations', 'userId');
  if (hasColumn) {
    await knex.schema.raw('ALTER TABLE celebrations DROP COLUMN "userId"');
  }
};
