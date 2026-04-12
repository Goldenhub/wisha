/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.raw('DROP INDEX IF EXISTS "confetti_activations_user_id_visitor_id_unique"');
  await knex.schema.raw('ALTER TABLE confetti_activations DROP COLUMN IF EXISTS "userId"');
  await knex.schema.raw('ALTER TABLE confetti_activations ADD COLUMN "celebrationId" INTEGER NOT NULL REFERENCES celebrations(id) ON DELETE CASCADE');
  await knex.schema.raw('CREATE UNIQUE INDEX "confetti_activations_celebration_visitor_unique" ON confetti_activations("celebrationId", "visitorId")');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.raw('DROP INDEX IF EXISTS "confetti_activations_celebration_visitor_unique"');
  await knex.schema.raw('ALTER TABLE confetti_activations DROP COLUMN IF EXISTS "celebrationId"');
  await knex.schema.raw('ALTER TABLE confetti_activations ADD COLUMN "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE');
  await knex.schema.raw('CREATE UNIQUE INDEX "confetti_activations_user_visitor_unique" ON confetti_activations("userId", "visitorId")');
};
