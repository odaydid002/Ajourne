/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('publishers', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('device_id').references('id').inTable('devices').onDelete('SET NULL');
    table.string('name');
    table.string('email').unique().notNullable();
    table.boolean('email_verified').defaultTo(false);
    table.timestamps(true, true); // created_at & updated_at
    table.timestamp('verified_at');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('publishers');
};
