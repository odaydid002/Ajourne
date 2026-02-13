const db = require('../config/db');

class UnitModel {
  static async create(data) {
    const [unit] = await db('units')
      .insert(data)
      .returning('*');
    return unit;
  }

  static async getById(id) {
    return db('units').where({ id }).first();
  }

  static async getBySemester(semesterId) {
    return db('units')
      .where({ semester_id: semesterId, deleted_at: null })
      .orderBy('created_at');
  }

  static async update(id, data) {
    const [unit] = await db('units')
      .where({ id })
      .update(data)
      .returning('*');
    return unit;
  }

  static async softDelete(id) {
    return this.update(id, { deleted_at: db.fn.now() });
  }
}

module.exports = UnitModel;
