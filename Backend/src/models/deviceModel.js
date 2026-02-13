const db = require('../config/db');

class DeviceModel {
  static async create() {
    const [device] = await db('devices')
      .insert({})
      .returning('*');
    return device;
  }

  static async getById(id) {
    return db('devices').where({ id }).first();
  }

  static async getOrCreate(deviceId) {
    let device = await this.getById(deviceId);
    if (!device) {
      device = await this.create();
    }
    return device;
  }
}

module.exports = DeviceModel;
