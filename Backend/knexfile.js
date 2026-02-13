require('dotenv').config(); // Load .env variables

module.exports = {

  // DEVELOPMENT CONFIG
  development: {
    client: 'pg', // PostgreSQL
    connection: {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'mydatabase',
      port: process.env.DB_PORT || 5432,
      ssl: { rejectUnauthorized: false }, // Enable SSL for development
    },
    pool: { min: 2, max: 10 }, // Connection pool
    migrations: {
      directory: './src/migrations',
      tableName: 'knex_migrations', // Track migrations
    },
    seeds: {
      directory: './src/seeds',
    },
    debug: true, // Enable SQL query logging in dev
  },

  // PRODUCTION CONFIG
  production: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      ssl: { rejectUnauthorized: false }, // Needed if using cloud DB like Heroku
    },
    pool: { min: 2, max: 20 },
    migrations: {
      directory: './src/migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './src/seeds',
    },
    debug: false, // Turn off SQL logs in production
  },

  // OPTIONAL: TEST CONFIG
  test: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_TEST_NAME || 'mydatabase_test',
      port: process.env.DB_PORT || 5432,
    },
    pool: { min: 1, max: 5 },
    migrations: {
      directory: './src/migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './src/seeds',
    },
    debug: false,
  },

};
