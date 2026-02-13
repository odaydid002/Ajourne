const db = require('../config/db');

class ModuleModel {
  static async create(data) {
    const [module] = await db('modules')
      .insert(data)
      .returning('*');
    return module;
  }

  static async getById(id) {
    return db('modules').where({ id }).first();
  }

  static async getBySemester(semesterId) {
    return db('modules')
      .where({ semester_id: semesterId, deleted_at: null })
      .orderBy('created_at');
  }

  static async getByUnit(unitId) {
    return db('modules')
      .where({ unit_id: unitId, deleted_at: null })
      .orderBy('created_at');
  }

  static async update(id, data) {
    const [module] = await db('modules')
      .where({ id })
      .update(data)
      .returning('*');
    return module;
  }

  static async softDelete(id) {
    return this.update(id, { deleted_at: db.fn.now() });
  }
}

module.exports = ModuleModel;
