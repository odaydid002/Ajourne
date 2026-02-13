const db = require('../config/db');

class SemesterModel {
  static async create(data) {
    const [semester] = await db('semesters')
      .insert(data)
      .returning('*');
    return semester;
  }

  static async getById(id) {
    return db('semesters').where({ id }).first();
  }

  static async getByCalculator(calculatorId) {
    return db('semesters')
      .where({ calculator_id: calculatorId, deleted_at: null })
      .orderBy('name');
  }

  static async update(id, data) {
    const [semester] = await db('semesters')
      .where({ id })
      .update(data)
      .returning('*');
    return semester;
  }

  static async softDelete(id) {
    return this.update(id, { deleted_at: db.fn.now() });
  }
}

module.exports = SemesterModel;
