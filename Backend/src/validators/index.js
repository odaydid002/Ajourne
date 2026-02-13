const validateDevice = (req, res, next) => {
  const { device_id } = req.body || req.query || req.params;
  if (!device_id) {
    return res.status(400).json({ error: 'device_id is required' });
  }
  next();
};

const validatePublisher = (data) => {
  const errors = {};
  if (!data.email || !data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.email = 'Valid email is required';
  }
  if (!data.device_id) {
    errors.device_id = 'device_id is required';
  }
  if (data.name && data.name.trim().length === 0) {
    errors.name = 'Name cannot be empty';
  }
  return { valid: Object.keys(errors).length === 0, errors };
};

const validateCalculator = (data) => {
  const errors = {};
  if (!data.title || data.title.trim().length === 0) {
    errors.title = 'Title is required';
  }
  if (!['simple', 'advanced'].includes(data.type)) {
    errors.type = 'Type must be "simple" or "advanced"';
  }
  return { valid: Object.keys(errors).length === 0, errors };
};

const validateSemester = (data) => {
  const errors = {};
  if (!data.calculator_id) {
    errors.calculator_id = 'calculator_id is required';
  }
  if (!['s1', 's2'].includes(data.name)) {
    errors.name = 'Semester name must be "s1" or "s2"';
  }
  return { valid: Object.keys(errors).length === 0, errors };
};

const validateUnit = (data) => {
  const errors = {};
  if (!data.semester_id) {
    errors.semester_id = 'semester_id is required';
  }
  if (!data.title || data.title.trim().length === 0) {
    errors.title = 'Title is required';
  }
  return { valid: Object.keys(errors).length === 0, errors };
};

const validateModule = (data) => {
  const errors = {};
  if (!data.semester_id) {
    errors.semester_id = 'semester_id is required';
  }
  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Name is required';
  }
  if (data.coeff !== undefined && (data.coeff < 0 || !Number.isInteger(data.coeff))) {
    errors.coeff = 'Coefficient must be a non-negative integer';
  }
  if (data.weight_exam !== undefined && (data.weight_exam < 0 || data.weight_exam > 100)) {
    errors.weight_exam = 'Weight exam must be between 0 and 100';
  }
  if (data.weight_td !== undefined && (data.weight_td < 0 || data.weight_td > 100)) {
    errors.weight_td = 'Weight td must be between 0 and 100';
  }
  if (data.weight_tp !== undefined && (data.weight_tp < 0 || data.weight_tp > 100)) {
    errors.weight_tp = 'Weight tp must be between 0 and 100';
  }
  return { valid: Object.keys(errors).length === 0, errors };
};

const validateRating = (data) => {
  const errors = {};
  if (!data.calculator_id) {
    errors.calculator_id = 'calculator_id is required';
  }
  if (!data.device_id) {
    errors.device_id = 'device_id is required';
  }
  if (!data.rating || data.rating < 1 || data.rating > 5) {
    errors.rating = 'Rating must be between 1 and 5';
  }
  return { valid: Object.keys(errors).length === 0, errors };
};

module.exports = {
  validateDevice,
  validatePublisher,
  validateCalculator,
  validateSemester,
  validateUnit,
  validateModule,
  validateRating
};
