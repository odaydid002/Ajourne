const knex = require('knex');
const config = require('../../knexfile');

require('dotenv').config();

// Get environment, default to development
const environment = process.env.NODE_ENV || 'development';

// Initialize Knex instance
const db = knex(config[environment]);

// Test connection
db.raw('SELECT 1')
  .then(() => {
    console.log(`✓ Connected to PostgreSQL (${environment})`);
  })
  .catch((err) => {
    console.error('✗ Failed to connect to PostgreSQL:', err.message);
  });

module.exports = db;
