const db = require('../config/db');

class UsageModel {
  static async trackUsage(calculatorId, deviceId) {
    const usage = await db('calculator_usage')
      .where({ calculator_id: calculatorId, device_id: deviceId })
      .first();

    if (usage) {
      return usage;
    }

    const [newUsage] = await db('calculator_usage')
      .insert({ calculator_id: calculatorId, device_id: deviceId })
      .returning('*');
    return newUsage;
  }

  static async getByCalculator(calculatorId, limit = 50, offset = 0) {
    return db('calculator_usage')
      .where({ calculator_id: calculatorId })
      .limit(limit)
      .offset(offset)
      .orderBy('first_used_at', 'desc');
  }

  static async getStats(calculatorId) {
    return db('calculator_usage')
      .where({ calculator_id: calculatorId })
      .count('* as total_users')
      .first();
  }
}

module.exports = UsageModel;
