/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('calculator_usage', (table) => {
    table.uuid('calculator_id').notNullable().references('id').inTable('calculators').onDelete('CASCADE');
    table.uuid('device_id').notNullable().references('id').inTable('devices').onDelete('CASCADE');
    table.timestamp('first_used_at').defaultTo(knex.fn.now());
    table.primary(['calculator_id', 'device_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('calculator_usage');
};
