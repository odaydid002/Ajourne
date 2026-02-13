const SemesterModel = require('../models/semesterModel');
const CalculatorModel = require('../models/calculatorModel');
const { validateSemester } = require('../validators');
const { v4: uuidv4 } = require('uuid');

exports.createSemester = async (req, res) => {
  try {
    const { calculator_id, name } = req.body;

    const validation = validateSemester({ calculator_id, name });
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

    const semester = await SemesterModel.create({
      id: uuidv4(),
      calculator_id,
      name
    });

    res.status(201).json({
      success: true,
      message: 'Semester created successfully',
      data: semester
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getSemester = async (req, res) => {
  try {
    const { id } = req.params;
    const semester = await SemesterModel.getById(id);

    if (!semester) {
      return res.status(404).json({
        success: false,
        error: 'Semester not found'
      });
    }

    res.status(200).json({
      success: true,
      data: semester
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getSemestersByCalculator = async (req, res) => {
  try {
    const { calculatorId } = req.params;

    const calculator = await CalculatorModel.getById(calculatorId);
    if (!calculator) {
      return res.status(404).json({
        success: false,
        error: 'Calculator not found'
      });
    }

    const semesters = await SemesterModel.getByCalculator(calculatorId);

    res.status(200).json({
      success: true,
      data: semesters
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.updateSemester = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const semester = await SemesterModel.getById(id);
    if (!semester) {
      return res.status(404).json({
        success: false,
        error: 'Semester not found'
      });
    }

    const updated = await SemesterModel.update(id, {
      name: name || semester.name
    });

    res.status(200).json({
      success: true,
      message: 'Semester updated successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.deleteSemester = async (req, res) => {
  try {
    const { id } = req.params;

    const semester = await SemesterModel.getById(id);
    if (!semester) {
      return res.status(404).json({
        success: false,
        error: 'Semester not found'
      });
    }

    await SemesterModel.softDelete(id);

    res.status(200).json({
      success: true,
      message: 'Semester deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
