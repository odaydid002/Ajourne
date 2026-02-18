const CalculatorModel = require('../models/calculatorModel');
const PublisherModel = require('../models/publisherModel');
const db = require('../config/db');
const { validateCalculator } = require('../validators');
const { v4: uuidv4 } = require('uuid');

exports.createCalculator = async (req, res) => {
  try {
    const { title, description, type, device_id, publisher_id, speciality, level, university_name } = req.body;

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
      published: publisher_id ? true : false,
      speciality: speciality || null,
      level: level || null,
      university_name: university_name || null
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
    const { title, description, type, speciality, level, university_name } = req.body;

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
      type: type || calculator.type,
      speciality: typeof speciality !== 'undefined' ? speciality : calculator.speciality,
      level: typeof level !== 'undefined' ? level : calculator.level,
      university_name: typeof university_name !== 'undefined' ? university_name : calculator.university_name
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

// Create calculator and nested semesters / units / modules in one request
exports.createCalculatorAllInOne = async (req, res) => {
  const { publisherId } = req.params;
  const { title, description, type, device_id, structure, speciality, level, university_name } = req.body;

  if (!title || !type) {
    return res.status(400).json({ success: false, error: 'title and type are required' });
  }

  try {
    const publisher = await PublisherModel.getById(publisherId);
    if (!publisher) {
      return res.status(404).json({ success: false, error: 'Publisher not found' });
    }

    const trx = await db.transaction();
    try {
      const [calculator] = await trx('calculators')
        .insert({
          id: uuidv4(),
          title,
          description: description || null,
          type,
          device_id: device_id || null,
          publisher_id: publisherId,
          published: true,
          speciality: speciality || null,
          level: level || null,
          university_name: university_name || null
        })
        .returning('*');

      const semestersMap = {};

      const getOrCreateSemester = async (name) => {
        if (!name) name = 's1';
        if (semestersMap[name]) return semestersMap[name];
        const [sem] = await trx('semesters')
          .insert({ id: require('uuid').v4(), calculator_id: calculator.id, name })
          .returning('*');
        semestersMap[name] = sem;
        return sem;
      };

      if (type === 'simple') {
        const items = Array.isArray(structure) ? structure : req.body.modules || [];
        for (const it of items) {
          const sem = await getOrCreateSemester(it.semester || 's1');
          const moduleData = {
            id: it.id || require('uuid').v4(),
            semester_id: sem.id,
            unit_id: null,
            name: it.name || '',
            coeff: typeof it.coeff !== 'undefined' ? it.coeff : 0,
            has_td: !!it.hasTd,
            has_tp: !!it.hasTp,
            credit: it.credit || null,
            weight_exam: it.weight_exam || null,
            weight_td: it.weight_td || null,
            weight_tp: it.weight_tp || null
          };
          await trx('modules').insert(moduleData);
        }
      } else if (type === 'advanced') {
        const units = Array.isArray(structure) ? structure : req.body.units || [];
        for (const u of units) {
          const sem = await getOrCreateSemester(u.semester || 's1');
          const [unit] = await trx('units')
            .insert({ id: u.id || require('uuid').v4(), semester_id: sem.id, title: u.title || '' })
            .returning('*');

          const mods = Array.isArray(u.modules) ? u.modules : [];
          for (const m of mods) {
            const moduleData = {
              id: m.id || require('uuid').v4(),
              semester_id: sem.id,
              unit_id: unit.id,
              name: m.name || '',
              coeff: typeof m.coeff !== 'undefined' ? m.coeff : 0,
              has_td: !!m.hasTd,
              has_tp: !!m.hasTp,
              credit: m.credit || null,
              weight_exam: m.weight_exam || null,
              weight_td: m.weight_td || null,
              weight_tp: m.weight_tp || null
            };
            await trx('modules').insert(moduleData);
          }
        }
      } else {
        await trx.rollback();
        return res.status(400).json({ success: false, error: 'Invalid calculator type' });
      }

      await trx.commit();

      const created = await CalculatorModel.getById(calculator.id);
      return res.status(201).json({ success: true, data: { calculator: created } });
    } catch (innerErr) {
      await trx.rollback();
      throw innerErr;
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
