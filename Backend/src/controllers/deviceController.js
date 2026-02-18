const DeviceModel = require('../models/deviceModel');

exports.createDevice = async (req, res) => {
  try {
    const { name, age, speciality, level, university } = req.body || {};
    const device = await DeviceModel.create({ name, age, speciality, level, university });
    res.status(201).json({
      success: true,
      message: 'Device created successfully',
      data: device
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const device = await DeviceModel.getById(id);
    
    if (!device) {
      return res.status(404).json({
        success: false,
        error: 'Device not found'
      });
    }

    res.status(200).json({
      success: true,
      data: device
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getOrCreateDevice = async (req, res) => {
  try {
    const { device_id } = req.body;
    const { name, age, speciality, level, university } = req.body || {};
    let device = await DeviceModel.getById(device_id);
    if (!device) {
      device = await DeviceModel.create({ id: device_id, name, age, speciality, level, university });
    }

    res.status(200).json({
      success: true,
      data: device
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
