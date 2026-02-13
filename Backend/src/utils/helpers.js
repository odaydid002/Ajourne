// Pagination helper
const getPagination = (query) => {
  const limit = Math.min(parseInt(query.limit) || 20, 100); // Max 100
  const offset = Math.max(parseInt(query.offset) || 0, 0);
  return { limit, offset };
};

// Response wrapper
const sendSuccess = (res, data, message = 'Success', statusCode = 200, pagination = null) => {
  const response = {
    success: true,
    message,
    data
  };
  if (pagination) {
    response.pagination = pagination;
  }
  res.status(statusCode).json(response);
};

const sendError = (res, error, statusCode = 500, errors = null) => {
  const response = {
    success: false,
    error
  };
  if (errors) {
    response.errors = errors;
  }
  res.status(statusCode).json(response);
};

// Validation helper
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validateUUID = (uuid) => {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
};

// Rating validator
const validateRating = (rating) => {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
};

// Calculator type validator
const validateCalculatorType = (type) => {
  return ['simple', 'advanced'].includes(type);
};

// Semester name validator
const validateSemesterName = (name) => {
  return ['s1', 's2'].includes(name.toLowerCase());
};

module.exports = {
  getPagination,
  sendSuccess,
  sendError,
  validateEmail,
  validateUUID,
  validateRating,
  validateCalculatorType,
  validateSemesterName
};
