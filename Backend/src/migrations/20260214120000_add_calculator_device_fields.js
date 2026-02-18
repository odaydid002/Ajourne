/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return Promise.all([
    knex.schema.alterTable('calculators', (table) => {
      table.string('speciality');
      table.string('level');
      table.string('university_name');
    }),
    knex.schema.alterTable('devices', (table) => {
      table.string('speciality');
      table.string('level');
      table.string('university');
      table.string('name');
      table.integer('age');
    })
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return Promise.all([
    knex.schema.alterTable('calculators', (table) => {
      table.dropColumn('speciality');
      table.dropColumn('level');
      table.dropColumn('university_name');
    }),
    knex.schema.alterTable('devices', (table) => {
      table.dropColumn('speciality');
      table.dropColumn('level');
      table.dropColumn('university');
      table.dropColumn('name');
      table.dropColumn('age');
    })
  ]);
};
