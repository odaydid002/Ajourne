const db = require('../config/db');

class RatingModel {
  static async create(data) {
    const [rating] = await db('calculator_ratings')
      .insert(data)
      .upsert(['calculator_id', 'device_id'])
      .returning('*');
    return rating;
  }

  static async getById(id) {
    return db('calculator_ratings').where({ id }).first();
  }

  static async getByCalculatorAndDevice(calculatorId, deviceId) {
    return db('calculator_ratings')
      .where({ calculator_id: calculatorId, device_id: deviceId })
      .first();
  }

  static async getByCalculator(calculatorId, limit = 50, offset = 0) {
    return db('calculator_ratings')
      .where({ calculator_id: calculatorId })
      .limit(limit)
      .offset(offset)
      .orderBy('created_at', 'desc');
  }

  static async getRatingStats(calculatorId) {
    return db('calculator_ratings')
      .where({ calculator_id: calculatorId })
      .select(
        db.raw('COUNT(*) as count'),
        db.raw('ROUND(AVG(rating)::numeric, 2) as average')
      )
      .first();
  }

  static async delete(id) {
    return db('calculator_ratings').where({ id }).delete();
  }

  static async updateRatingStats(calculatorId) {
    const stats = await this.getRatingStats(calculatorId);
    await db('calculators')
      .where({ id: calculatorId })
      .update({
        ratings_count: stats.count,
        ratings_avg: stats.average || 0
      });
  }
}

module.exports = RatingModel;
