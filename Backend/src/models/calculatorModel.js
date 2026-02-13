const db = require('../config/db');

class CalculatorModel {
  static async create(data) {
    const [calculator] = await db('calculators')
      .insert(data)
      .returning('*');
    return calculator;
  }

  static async getById(id) {
    return db('calculators').where({ id }).first();
  }

  static async getPublished(limit = 20, offset = 0) {
    return db('calculators')
      .where({ published: true, deleted_at: null })
      .limit(limit)
      .offset(offset)
      .orderBy('created_at', 'desc')
      .select('*',
        db.raw('(SELECT COUNT(*) FROM calculator_ratings WHERE calculator_id = calculators.id) as ratings_count'),
        db.raw('(SELECT COUNT(*) FROM calculator_usage WHERE calculator_id = calculators.id) as usage_count')
      );
  }

  static async getByPublisher(publisherId, limit = 20, offset = 0) {
    return db('calculators')
      .where({ publisher_id: publisherId, deleted_at: null })
      .limit(limit)
      .offset(offset)
      .orderBy('created_at', 'desc');
  }

  static async getByDevice(deviceId, limit = 20, offset = 0) {
    return db('calculators')
      .where({ device_id: deviceId, deleted_at: null })
      .limit(limit)
      .offset(offset)
      .orderBy('created_at', 'desc');
  }

  static async search(query, limit = 20, offset = 0) {
    return db('calculators')
      .where({ published: true, deleted_at: null })
      .andWhere(function() {
        this.whereRaw('title ILIKE ?', [`%${query}%`])
          .orWhereRaw('description ILIKE ?', [`%${query}%`]);
      })
      .limit(limit)
      .offset(offset)
      .orderBy('ratings_avg', 'desc');
  }

  static async update(id, data) {
    const [calculator] = await db('calculators')
      .where({ id })
      .update(data)
      .returning('*');
    return calculator;
  }

  static async softDelete(id) {
    return this.update(id, { deleted_at: db.fn.now() });
  }

  static async publish(id, publisherId) {
    return this.update(id, {
      publisher_id: publisherId,
      published: true
    });
  }

  static async incrementUsage(calculatorId) {
    return db('calculators')
      .where({ id: calculatorId })
      .increment('usage_count', 1);
  }
}

module.exports = CalculatorModel;
