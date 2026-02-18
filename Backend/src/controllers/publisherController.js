const PublisherModel = require('../models/publisherModel');
const DeviceModel = require('../models/deviceModel');
const { validatePublisher } = require('../validators');

exports.registerPublisher = async (req, res) => {
  try {
    const { name, email, device_id, device_name, device_age, device_speciality, device_level, device_university } = req.body;

    const validation = validatePublisher({ name, email });
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors
      });
    }

    const existingPublisher = await PublisherModel.getByEmail(email);
    if (existingPublisher) {
      return res.status(409).json({
        success: false,
        error: 'Email already registered'
      });
    }

    let finalDeviceId = device_id || null;
    if (!finalDeviceId && (device_name || device_age || device_speciality || device_level || device_university)) {
      const dev = await DeviceModel.create({
        name: device_name || null,
        age: device_age || null,
        speciality: device_speciality || null,
        level: device_level || null,
        university: device_university || null
      });
      finalDeviceId = dev.id;
    }

    const publisher = await PublisherModel.create({
      name,
      email,
      device_id: finalDeviceId
    });

    res.status(201).json({
      success: true,
      message: 'Publisher registered successfully',
      data: publisher
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getPublisher = async (req, res) => {
  try {
    const { id } = req.params;
    const publisher = await PublisherModel.getById(id);

    if (!publisher) {
      return res.status(404).json({
        success: false,
        error: 'Publisher not found'
      });
    }

    const calculatorCount = await PublisherModel.getCalculatorCount(id);

    res.status(200).json({
      success: true,
      data: {
        ...publisher,
        published_calculators_count: calculatorCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getAllPublishers = async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const publishers = await PublisherModel.getAll(
      parseInt(limit),
      parseInt(offset)
    );

    res.status(200).json({
      success: true,
      data: publishers,
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

exports.updatePublisher = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const publisher = await PublisherModel.getById(id);
    if (!publisher) {
      return res.status(404).json({
        success: false,
        error: 'Publisher not found'
      });
    }

    const updated = await PublisherModel.update(id, { name: name || publisher.name });

    res.status(200).json({
      success: true,
      message: 'Publisher updated successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { id } = req.params;

    const publisher = await PublisherModel.getById(id);
    if (!publisher) {
      return res.status(404).json({
        success: false,
        error: 'Publisher not found'
      });
    }

    if (publisher.email_verified) {
      return res.status(400).json({
        success: false,
        error: 'Email already verified'
      });
    }

    const verified = await PublisherModel.verifyEmail(id);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      data: verified
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
