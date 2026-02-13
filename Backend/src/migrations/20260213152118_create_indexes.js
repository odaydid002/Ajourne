/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return Promise.all([
    knex.schema.raw('CREATE INDEX idx_calculators_device ON calculators(device_id)'),
    knex.schema.raw('CREATE INDEX idx_semesters_calculator ON semesters(calculator_id)'),
    knex.schema.raw('CREATE INDEX idx_units_semester ON units(semester_id)'),
    knex.schema.raw('CREATE INDEX idx_modules_semester ON modules(semester_id)'),
    knex.schema.raw('CREATE INDEX idx_modules_unit ON modules(unit_id)'),
    knex.schema.raw('CREATE INDEX idx_ratings_calculator ON calculator_ratings(calculator_id)'),
    knex.schema.raw('CREATE INDEX idx_usage_calculator ON calculator_usage(calculator_id)'),
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return Promise.all([
    knex.schema.raw('DROP INDEX IF EXISTS idx_calculators_device'),
    knex.schema.raw('DROP INDEX IF EXISTS idx_semesters_calculator'),
    knex.schema.raw('DROP INDEX IF EXISTS idx_units_semester'),
    knex.schema.raw('DROP INDEX IF EXISTS idx_modules_semester'),
    knex.schema.raw('DROP INDEX IF EXISTS idx_modules_unit'),
    knex.schema.raw('DROP INDEX IF EXISTS idx_ratings_calculator'),
    knex.schema.raw('DROP INDEX IF EXISTS idx_usage_calculator'),
  ]);
};
