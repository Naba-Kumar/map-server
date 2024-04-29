const express = require('express');
const pg = require('pg');
// const shp2pgsql = require('shp2pgsql');

const app = express();

// Connect to the PostgreSQL database
const client = new pg.Client({
  host: 'localhost',
  port: 5432,
  database: 'my_database',
  user: 'postgres',
  password: 'password'
});

// // Create a new table to store the shapefile data
// client.query('CREATE TABLE IF NOT EXISTS shapefile (
//   id SERIAL PRIMARY KEY,
//   geom geometry
// )');

// Create a new table to store the shapefile data
client.query`('CREATE TABLE IF NOT EXISTS shapefile (
    id SERIAL PRIMARY KEY,
    geom geometry
  );`
// Convert the shapefile to SQL statements
const sql = shp2pgsql('my_shapefile.shp');

// Execute the SQL statements to create and populate the table
client.query(sql);

// Start the Express application
app.listen(3000, () => {
  console.log('App listening on port 3000');
});