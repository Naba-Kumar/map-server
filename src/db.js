const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: '306090',
  host: 'localhost',
  port: 5432, // default Postgres port
  database: 'testgis'
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};