const CalculatorModel = require('../models/calculatorModel');
const PublisherModel = require('../models/publisherModel');
const { validateCalculator } = require('../validators');
const { v4: uuidv4 } = require('uuid');

exports.createCalculator = async (req, res) => {
  try {
    const { title, description, type, device_id, publisher_id } = req.body;

    const validation = validateCalculator({ title, type });
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors
      });
    }

    const calculator = await CalculatorModel.create({
      id: uuidv4(),
      title,
      description,
      type,
      device_id,
      publisher_id: publisher_id || null,
      published: publisher_id ? true : false
    });

    res.status(201).json({
      success: true,
      message: 'Calculator created successfully',
      data: calculator
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getCalculator = async (req, res) => {
  try {
    const { id } = req.params;
    const calculator = await CalculatorModel.getById(id);

    if (!calculator) {
      return res.status(404).json({
        success: false,
        error: 'Calculator not found'
      });
    }

    res.status(200).json({
      success: true,
      data: calculator
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getPublishedCalculators = async (req, res) => {
  try {
    const { limit = 20, offset = 0, search } = req.query;

    let calculators;
    if (search) {
      calculators = await CalculatorModel.search(search, parseInt(limit), parseInt(offset));
    } else {
      calculators = await CalculatorModel.getPublished(parseInt(limit), parseInt(offset));
    }

    res.status(200).json({
      success: true,
      data: calculators,
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

exports.getCalculatorsByPublisher = async (req, res) => {
  try {
    const { publisherId } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const publisher = await PublisherModel.getById(publisherId);
    if (!publisher) {
      return res.status(404).json({
        success: false,
        error: 'Publisher not found'
      });
    }

    const calculators = await CalculatorModel.getByPublisher(
      publisherId,
      parseInt(limit),
      parseInt(offset)
    );

    res.status(200).json({
      success: true,
      data: calculators,
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

exports.getCalculatorsByDevice = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const calculators = await CalculatorModel.getByDevice(
      deviceId,
      parseInt(limit),
      parseInt(offset)
    );

    res.status(200).json({
      success: true,
      data: calculators,
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

exports.updateCalculator = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type } = req.body;

    const calculator = await CalculatorModel.getById(id);
    if (!calculator) {
      return res.status(404).json({
        success: false,
        error: 'Calculator not found'
      });
    }

    const updated = await CalculatorModel.update(id, {
      title: title || calculator.title,
      description: description !== undefined ? description : calculator.description,
      type: type || calculator.type
    });

    res.status(200).json({
      success: true,
      message: 'Calculator updated successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.deleteCalculator = async (req, res) => {
  try {
    const { id } = req.params;

    const calculator = await CalculatorModel.getById(id);
    if (!calculator) {
      return res.status(404).json({
        success: false,
        error: 'Calculator not found'
      });
    }

    await CalculatorModel.softDelete(id);

    res.status(200).json({
      success: true,
      message: 'Calculator deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.publishCalculator = async (req, res) => {
  try {
    const { id } = req.params;
    const { publisher_id } = req.body;

    if (!publisher_id) {
      return res.status(400).json({
        success: false,
        error: 'publisher_id is required'
      });
    }

    const calculator = await CalculatorModel.getById(id);
    if (!calculator) {
      return res.status(404).json({
        success: false,
        error: 'Calculator not found'
      });
    }

    const publisher = await PublisherModel.getById(publisher_id);
    if (!publisher) {
      return res.status(404).json({
        success: false,
        error: 'Publisher not found'
      });
    }

    if (!publisher.email_verified) {
      return res.status(403).json({
        success: false,
        error: 'Publisher email must be verified to publish calculators'
      });
    }

    const published = await CalculatorModel.publish(id, publisher_id);

    res.status(200).json({
      success: true,
      message: 'Calculator published successfully',
      data: published
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.searchCalculators = async (req, res) => {
  try {
    const { q } = req.query;
    const { limit = 20, offset = 0 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query "q" is required'
      });
    }

    const calculators = await CalculatorModel.search(q, parseInt(limit), parseInt(offset));

    res.status(200).json({
      success: true,
      data: calculators,
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
