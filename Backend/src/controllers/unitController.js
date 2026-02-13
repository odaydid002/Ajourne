const UnitModel = require('../models/unitModel');
const SemesterModel = require('../models/semesterModel');
const { validateUnit } = require('../validators');
const { v4: uuidv4 } = require('uuid');

exports.createUnit = async (req, res) => {
  try {
    const { semester_id, title } = req.body;

    const validation = validateUnit({ semester_id, title });
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors
      });
    }

    const semester = await SemesterModel.getById(semester_id);
    if (!semester) {
      return res.status(404).json({
        success: false,
        error: 'Semester not found'
      });
    }

    const unit = await UnitModel.create({
      id: uuidv4(),
      semester_id,
      title
    });

    res.status(201).json({
      success: true,
      message: 'Unit created successfully',
      data: unit
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const unit = await UnitModel.getById(id);

    if (!unit) {
      return res.status(404).json({
        success: false,
        error: 'Unit not found'
      });
    }

    res.status(200).json({
      success: true,
      data: unit
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getUnitsBySemester = async (req, res) => {
  try {
    const { semesterId } = req.params;

    const semester = await SemesterModel.getById(semesterId);
    if (!semester) {
      return res.status(404).json({
        success: false,
        error: 'Semester not found'
      });
    }

    const units = await UnitModel.getBySemester(semesterId);

    res.status(200).json({
      success: true,
      data: units
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.updateUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const unit = await UnitModel.getById(id);
    if (!unit) {
      return res.status(404).json({
        success: false,
        error: 'Unit not found'
      });
    }

    const updated = await UnitModel.update(id, {
      title: title || unit.title
    });

    res.status(200).json({
      success: true,
      message: 'Unit updated successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.deleteUnit = async (req, res) => {
  try {
    const { id } = req.params;

    const unit = await UnitModel.getById(id);
    if (!unit) {
      return res.status(404).json({
        success: false,
        error: 'Unit not found'
      });
    }

    await UnitModel.softDelete(id);

    res.status(200).json({
      success: true,
      message: 'Unit deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
