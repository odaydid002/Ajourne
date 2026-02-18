const db = require('../config/db');

class DeviceModel {
  static async create(data = {}) {
    const payload = {
      id: data.id || require('uuid').v4(),
      name: data.name || null,
      age: typeof data.age !== 'undefined' ? data.age : null,
      speciality: data.speciality || null,
      level: data.level || null,
      university: data.university || null
    };
    const [device] = await db('devices')
      .insert(payload)
      .returning('*');
    return device;
  }

  static async getById(id) {
    return db('devices').where({ id }).first();
  }

  static async getOrCreate(deviceId) {
    let device = await this.getById(deviceId);
    if (!device) {
      device = await this.create({ id: deviceId });
    }
    return device;
  }
}

module.exports = DeviceModel;
