const express = require('express');
const router = express.Router();

// Controllers
const deviceController = require('../controllers/deviceController');
const publisherController = require('../controllers/publisherController');
const calculatorController = require('../controllers/calculatorController');
const semesterController = require('../controllers/semesterController');
const unitController = require('../controllers/unitController');
const moduleController = require('../controllers/moduleController');
const ratingController = require('../controllers/ratingController');
const usageController = require('../controllers/usageController');

// ==================== DEVICES ====================
router.post('/devices', deviceController.createDevice);
router.get('/devices/:id', deviceController.getDevice);
router.post('/devices/or-create', deviceController.getOrCreateDevice);

// ==================== PUBLISHERS ====================
router.post('/publishers', publisherController.registerPublisher);
router.get('/publishers', publisherController.getAllPublishers);
router.get('/publishers/:id', publisherController.getPublisher);
router.put('/publishers/:id', publisherController.updatePublisher);
router.post('/publishers/:id/verify-email', publisherController.verifyEmail);

// ==================== CALCULATORS ====================
router.post('/calculators', calculatorController.createCalculator);
router.get('/calculators', calculatorController.getPublishedCalculators);
router.get('/calculators/search', calculatorController.searchCalculators);
router.get('/calculators/:id', calculatorController.getCalculator);
router.put('/calculators/:id', calculatorController.updateCalculator);
router.delete('/calculators/:id', calculatorController.deleteCalculator);
router.post('/calculators/:id/publish', calculatorController.publishCalculator);

// Calculators by publisher
router.get('/publishers/:publisherId/calculators', calculatorController.getCalculatorsByPublisher);

// Create calculator with full structure (semesters, units, modules) for a publisher
router.post('/publishers/:publisherId/calculators/all-in-one', calculatorController.createCalculatorAllInOne);

// Calculators by device
router.get('/devices/:deviceId/calculators', calculatorController.getCalculatorsByDevice);

// ==================== SEMESTERS ====================
router.post('/semesters', semesterController.createSemester);
router.get('/semesters/:id', semesterController.getSemester);
router.put('/semesters/:id', semesterController.updateSemester);
router.delete('/semesters/:id', semesterController.deleteSemester);

// Semesters by calculator
router.get('/calculators/:calculatorId/semesters', semesterController.getSemestersByCalculator);

// ==================== UNITS ====================
router.post('/units', unitController.createUnit);
router.get('/units/:id', unitController.getUnit);
router.put('/units/:id', unitController.updateUnit);
router.delete('/units/:id', unitController.deleteUnit);

// Units by semester
router.get('/semesters/:semesterId/units', unitController.getUnitsBySemester);

// ==================== MODULES ====================
router.post('/modules', moduleController.createModule);
router.get('/modules/:id', moduleController.getModule);
router.put('/modules/:id', moduleController.updateModule);
router.delete('/modules/:id', moduleController.deleteModule);

// Modules by semester
router.get('/semesters/:semesterId/modules', moduleController.getModulesBySemester);

// Modules by unit
router.get('/units/:unitId/modules', moduleController.getModulesByUnit);

// ==================== RATINGS ====================
router.post('/ratings', ratingController.rateCalculator);
router.get('/ratings/:id', ratingController.getRating);
router.delete('/ratings/:id', ratingController.deleteRating);

// Ratings by calculator
router.get('/calculators/:calculatorId/ratings', ratingController.getRatingsByCalculator);
router.get('/calculators/:calculatorId/ratings/stats', ratingController.getRatingStats);

// Delete rating by device
router.delete('/calculators/:calculatorId/device/:deviceId/ratings', ratingController.deleteRatingByDevice);

// ==================== USAGE ====================
router.post('/usage', usageController.trackUsage);
router.get('/calculators/:calculatorId/usage', usageController.getUsageByCalculator);
router.get('/calculators/:calculatorId/usage/stats', usageController.getUsageStats);

module.exports = router;
