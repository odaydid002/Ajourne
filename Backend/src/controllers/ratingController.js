const RatingModel = require('../models/ratingModel');
const CalculatorModel = require('../models/calculatorModel');
const { validateRating } = require('../validators');
const { v4: uuidv4 } = require('uuid');

exports.rateCalculator = async (req, res) => {
  try {
    const { calculator_id, device_id, rating } = req.body;

    const validation = validateRating({ calculator_id, device_id, rating });
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors
      });
    }

    const calculator = await CalculatorModel.getById(calculator_id);
    if (!calculator) {
      return res.status(404).json({
        success: false,
        error: 'Calculator not found'
      });
    }

    const ratingRecord = await RatingModel.create({
      id: uuidv4(),
      calculator_id,
      device_id,
      rating
    });

    await RatingModel.updateRatingStats(calculator_id);

    res.status(201).json({
      success: true,
      message: 'Rating recorded successfully',
      data: ratingRecord
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getRating = async (req, res) => {
  try {
    const { id } = req.params;
    const rating = await RatingModel.getById(id);

    if (!rating) {
      return res.status(404).json({
        success: false,
        error: 'Rating not found'
      });
    }

    res.status(200).json({
      success: true,
      data: rating
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getRatingsByCalculator = async (req, res) => {
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

    const ratings = await RatingModel.getByCalculator(
      calculatorId,
      parseInt(limit),
      parseInt(offset)
    );

    const stats = await RatingModel.getRatingStats(calculatorId);

    res.status(200).json({
      success: true,
      data: ratings,
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

exports.getRatingStats = async (req, res) => {
  try {
    const { calculatorId } = req.params;

    const calculator = await CalculatorModel.getById(calculatorId);
    if (!calculator) {
      return res.status(404).json({
        success: false,
        error: 'Calculator not found'
      });
    }

    const stats = await RatingModel.getRatingStats(calculatorId);

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

exports.deleteRating = async (req, res) => {
  try {
    const { id } = req.params;

    const rating = await RatingModel.getById(id);
    if (!rating) {
      return res.status(404).json({
        success: false,
        error: 'Rating not found'
      });
    }

    await RatingModel.delete(id);
    await RatingModel.updateRatingStats(rating.calculator_id);

    res.status(200).json({
      success: true,
      message: 'Rating deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.deleteRatingByDevice = async (req, res) => {
  try {
    const { calculatorId, deviceId } = req.params;

    const rating = await RatingModel.getByCalculatorAndDevice(calculatorId, deviceId);
    if (!rating) {
      return res.status(404).json({
        success: false,
        error: 'Rating not found'
      });
    }

    await RatingModel.delete(rating.id);
    await RatingModel.updateRatingStats(calculatorId);

    res.status(200).json({
      success: true,
      message: 'Rating deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
