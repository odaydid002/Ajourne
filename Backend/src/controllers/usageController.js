const UsageModel = require('../models/usageModel');
const CalculatorModel = require('../models/calculatorModel');
const DeviceModel = require('../models/deviceModel');

exports.trackUsage = async (req, res) => {
  try {
    let { calculator_id, device_id, device_name, device_age, device_speciality, device_level, device_university } = req.body;

    if (!device_id && (device_name || device_age || device_speciality || device_level || device_university)) {
      const dev = await DeviceModel.create({
        name: device_name || null,
        age: device_age || null,
        speciality: device_speciality || null,
        level: device_level || null,
        university: device_university || null
      });
      device_id = dev.id;
    }

    if (!calculator_id || !device_id) {
      return res.status(400).json({
        success: false,
        error: 'calculator_id and device_id are required'
      });
    }

    const calculator = await CalculatorModel.getById(calculator_id);
    if (!calculator) {
      return res.status(404).json({
        success: false,
        error: 'Calculator not found'
      });
    }

    const usage = await UsageModel.trackUsage(calculator_id, device_id);
    await CalculatorModel.incrementUsage(calculator_id);

    res.status(201).json({
      success: true,
      message: 'Usage tracked successfully',
      data: usage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getUsageByCalculator = async (req, res) => {
  try {
    const { calculatorId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const calculator = await CalculatorModel.getById(calculatorId);
    if (!calculator) {
      return res.status(404).json({
        success: false,
        error: 'Calculator not found'
      });
    }

    const usage = await UsageModel.getByCalculator(
      calculatorId,
      parseInt(limit),
      parseInt(offset)
    );

    const stats = await UsageModel.getStats(calculatorId);

    res.status(200).json({
      success: true,
      data: usage,
      stats,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getUsageStats = async (req, res) => {
  try {
    const { calculatorId } = req.params;

    const calculator = await CalculatorModel.getById(calculatorId);
    if (!calculator) {
      return res.status(404).json({
        success: false,
        error: 'Calculator not found'
      });
    }

    const stats = await UsageModel.getStats(calculatorId);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
