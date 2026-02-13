/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('calculator_ratings', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('calculator_id').notNullable().references('id').inTable('calculators').onDelete('CASCADE');
    table.uuid('device_id').notNullable().references('id').inTable('devices').onDelete('CASCADE');
    table.integer('rating').notNullable();
    table.timestamps(true, true); // created_at & updated_at
    table.unique(['calculator_id', 'device_id']);
    table.check('rating BETWEEN 1 AND 5');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('calculator_ratings');
};
