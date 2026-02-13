const db = require('../config/db');

class PublisherModel {
  static async create(data) {
    const [publisher] = await db('publishers')
      .insert(data)
      .returning('*');
    return publisher;
  }

  static async getById(id) {
    return db('publishers').where({ id }).first();
  }

  static async getByEmail(email) {
    return db('publishers').where({ email }).first();
  }

  static async getAll(limit = 10, offset = 0) {
    return db('publishers')
      .where({ email_verified: true })
      .limit(limit)
      .offset(offset)
      .orderBy('created_at', 'desc');
  }

  static async update(id, data) {
    const [publisher] = await db('publishers')
      .where({ id })
      .update(data)
      .returning('*');
    return publisher;
  }

  static async verifyEmail(id) {
    return this.update(id, {
      email_verified: true,
      verified_at: db.fn.now()
    });
  }

  static async getCalculatorCount(publisherId) {
    const result = await db('calculators')
      .where({ publisher_id: publisherId, published: true })
      .count('id as count')
      .first();
    return result.count;
  }
}

module.exports = PublisherModel;
