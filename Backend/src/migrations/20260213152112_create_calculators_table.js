/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('calculators', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('publisher_id').references('id').inTable('publishers').onDelete('CASCADE');
    table.uuid('device_id').references('id').inTable('devices').onDelete('SET NULL');
    table.specificType('type', 'calculator_type').notNullable();
    table.string('title').notNullable();
    table.text('description');
    table.boolean('published').defaultTo(false);
    table.integer('ratings_count').defaultTo(0);
    table.decimal('ratings_avg', 3, 2).defaultTo(0);
    table.integer('usage_count').defaultTo(0);
    table.timestamps(true, true); // created_at & updated_at
    table.timestamp('deleted_at');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('calculators');
};
