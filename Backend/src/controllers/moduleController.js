const ModuleModel = require('../models/moduleModel');
const SemesterModel = require('../models/semesterModel');
const UnitModel = require('../models/unitModel');
const { validateModule } = require('../validators');
const { v4: uuidv4 } = require('uuid');

exports.createModule = async (req, res) => {
  try {
    const {
      semester_id,
      unit_id,
      name,
      coeff = 1,
      has_td = false,
      has_tp = false,
      credit,
      weight_exam,
      weight_td,
      weight_tp
    } = req.body;

    const validation = validateModule(req.body);
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

    if (unit_id) {
      const unit = await UnitModel.getById(unit_id);
      if (!unit) {
        return res.status(404).json({
          success: false,
          error: 'Unit not found'
        });
      }
    }

    const module = await ModuleModel.create({
      id: uuidv4(),
      semester_id,
      unit_id: unit_id || null,
      name,
      coeff,
      has_td,
      has_tp,
      credit: credit || null,
      weight_exam: weight_exam || null,
      weight_td: weight_td || null,
      weight_tp: weight_tp || null
    });

    res.status(201).json({
      success: true,
      message: 'Module created successfully',
      data: module
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getModule = async (req, res) => {
  try {
    const { id } = req.params;
    const module = await ModuleModel.getById(id);

    if (!module) {
      return res.status(404).json({
        success: false,
        error: 'Module not found'
      });
    }

    res.status(200).json({
      success: true,
      data: module
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getModulesBySemester = async (req, res) => {
  try {
    const { semesterId } = req.params;

    const semester = await SemesterModel.getById(semesterId);
    if (!semester) {
      return res.status(404).json({
        success: false,
        error: 'Semester not found'
      });
    }

    const modules = await ModuleModel.getBySemester(semesterId);

    res.status(200).json({
      success: true,
      data: modules
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getModulesByUnit = async (req, res) => {
  try {
    const { unitId } = req.params;

    const unit = await UnitModel.getById(unitId);
    if (!unit) {
      return res.status(404).json({
        success: false,
        error: 'Unit not found'
      });
    }

    const modules = await ModuleModel.getByUnit(unitId);

    res.status(200).json({
      success: true,
      data: modules
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.updateModule = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, coeff, has_td, has_tp, credit, weight_exam, weight_td, weight_tp } = req.body;

    const module = await ModuleModel.getById(id);
    if (!module) {
      return res.status(404).json({
        success: false,
        error: 'Module not found'
      });
    }

    const updated = await ModuleModel.update(id, {
      name: name || module.name,
      coeff: coeff !== undefined ? coeff : module.coeff,
      has_td: has_td !== undefined ? has_td : module.has_td,
      has_tp: has_tp !== undefined ? has_tp : module.has_tp,
      credit: credit !== undefined ? credit : module.credit,
      weight_exam: weight_exam !== undefined ? weight_exam : module.weight_exam,
      weight_td: weight_td !== undefined ? weight_td : module.weight_td,
      weight_tp: weight_tp !== undefined ? weight_tp : module.weight_tp
    });

    res.status(200).json({
      success: true,
      message: 'Module updated successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.deleteModule = async (req, res) => {
  try {
    const { id } = req.params;

    const module = await ModuleModel.getById(id);
    if (!module) {
      return res.status(404).json({
        success: false,
        error: 'Module not found'
      });
    }

    await ModuleModel.softDelete(id);

    res.status(200).json({
      success: true,
      message: 'Module deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
