/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('modules', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('semester_id').notNullable().references('id').inTable('semesters').onDelete('CASCADE');
    table.uuid('unit_id').references('id').inTable('units').onDelete('CASCADE');
    table.string('name').notNullable();
    table.integer('coeff').notNullable().defaultTo(1);
    table.boolean('has_td').defaultTo(false);
    table.boolean('has_tp').defaultTo(false);
    table.integer('credit');
    table.decimal('weight_exam', 5, 2);
    table.decimal('weight_td', 5, 2);
    table.decimal('weight_tp', 5, 2);
    table.timestamps(true, true); // created_at & updated_at
    table.timestamp('deleted_at');
    table.check('coeff >= 0');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('modules');
};
