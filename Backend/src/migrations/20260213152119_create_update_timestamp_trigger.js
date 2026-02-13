/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
       NEW.updated_at = NOW();
       RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS trig_update_calculators ON calculators;
    CREATE TRIGGER trig_update_calculators BEFORE UPDATE ON calculators
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS trig_update_semesters ON semesters;
    CREATE TRIGGER trig_update_semesters BEFORE UPDATE ON semesters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS trig_update_units ON units;
    CREATE TRIGGER trig_update_units BEFORE UPDATE ON units
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS trig_update_modules ON modules;
    CREATE TRIGGER trig_update_modules BEFORE UPDATE ON modules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS trig_update_ratings ON calculator_ratings;
    CREATE TRIGGER trig_update_ratings BEFORE UPDATE ON calculator_ratings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.raw(`
    DROP TRIGGER IF EXISTS trig_update_calculators ON calculators;
    DROP TRIGGER IF EXISTS trig_update_semesters ON semesters;
    DROP TRIGGER IF EXISTS trig_update_units ON units;
    DROP TRIGGER IF EXISTS trig_update_modules ON modules;
    DROP TRIGGER IF EXISTS trig_update_ratings ON calculator_ratings;
    DROP FUNCTION IF EXISTS update_updated_at_column();
  `);
};
