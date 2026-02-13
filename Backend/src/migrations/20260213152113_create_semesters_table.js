/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('semesters', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('calculator_id').notNullable().references('id').inTable('calculators').onDelete('CASCADE');
    table.string('name').notNullable();
    table.timestamps(true, true); // created_at & updated_at
    table.timestamp('deleted_at');
    table.check("name IN ('s1','s2')");
    table.unique(['calculator_id', 'name']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('semesters');
};
