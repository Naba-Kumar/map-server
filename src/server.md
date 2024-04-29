// const express = require('express');
// const multer = require('multer');
// const unzipper = require('unzipper');
// const fs = require('fs');
// const { Pool } = require('pg');
// const { Client } = require('pg');

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Multer configuration for handling file uploads
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// // PostgreSQL connection configuration
// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'testgis',
//   password: '306090',
//   port: 5432,
// });

// // Route for uploading shapefile
// app.post('/upload', upload.single('shapefile'), async (req, res) => {
//   try {
//     const file = req.file;
//     if (!file) {
//       return res.status(400).send('Please upload a file');
//     }

//     const zipBuffer = file.buffer;

//     // Unzip the uploaded file
//     const unzipDir = await unzipper.Open.buffer(zipBuffer);
//     const files = unzipDir.files;

//  // Extract necessary files
// let shapefilePath = null;
// let shxFile = null;
// let dbfFile = null;
// let prjFile = null;

// files.forEach((file) => {
//   const fileName = file.path.split('/').pop();
//   if (fileName.endsWith('.shp')) {
//     shapefilePath = file.path;
//   } else if (fileName.endsWith('.shx')) {
//     shxFile = file;
//   } else if (fileName.endsWith('.dbf')) {
//     dbfFile = file;
//   } else if (fileName.endsWith('.prj')) {
//     prjFile = file;
//   }
// });

// if (!shapefilePath || !shxFile || !dbfFile || !prjFile) {
//   return res.status(400).send('Shapefile is missing one or more required files');
// }

//     // Insert the shapefile into PostgreSQL with PostGIS
//     const client = new Client({
//         user: 'postgres',
//         host: 'localhost',
//         database: 'testgis',
//         password: '306090',
//         port: 5432,
//     });

//     await client.connect();

//     const query = `
//       CREATE TABLE IF NOT EXISTS shapefile_table (
//         id SERIAL PRIMARY KEY,
//         geom geometry(Geometry, 4326),
//         attributes jsonb
//       );

//       SELECT AddGeometryColumn('public', 'shapefile_table', 'geom', 4326, 'GEOMETRY', 2);
//       CREATE INDEX shapefile_table_geom_gist ON shapefile_table USING gist (geom);

//       INSERT INTO shapefile_table (geom, attributes)
//       VALUES (ST_SetSRID(ST_GeomFromEWKB($1), 4326), $2);
//     `;

//     const data = fs.readFileSync(shapefilePath);

//     await client.query(query, [
//       data,
//       JSON.stringify({}),
//     ]);

//     await client.end();

//     res.status(200).send('Shapefile uploaded successfully');
//   } catch (error) {
//     console.error('Error uploading shapefile:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// // Serve the HTML file
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// ------------------------------------------------------

// const express = require('express');
// const shp2pgsql = require('shp2pgsql');
// const pg = require('pg');

// const app = express();

// app.post('/upload', async (req, res) => {
//   // Get the shapefile from the request
//   const shapefile = req.files.shapefile;

//   // Create a new PostGIS table to store the shapefile data
//   const table = await shp2pgsql(shapefile);

//   // Connect to the Postgres database
//   const client = new pg.Client({
//     host: 'localhost',
//     port: 5432,
//     database: 'testgis',
//     user: 'postgres',
//     password: '306090'
//   });

//   // Insert the shapefile data into the PostGIS table
//   await client.query(`INSERT INTO ${table} VALUES ($1)`, [shapefile]);

//   // Close the connection to the Postgres database
//   client.end();

//   // Send a response to the client
//   res.send('Shapefile uploaded successfully!');
// });

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

// app.listen(3000, () => {
//   console.log('Server listening on port 3000');
// });

// ---------------------------------------------------

// const express = require('express');
// const multer = require('multer');
// const { exec } = require('child_process');
// const { Pool , Client  } = require('pg'); // or your preferred Postgres library

// const app = express();

// // Configure multer for file upload (adjust storage and limits as needed)
// const upload = multer({ dest: 'uploads/' });

// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'testgis',
//   password: '306090',
//   port: 5432, // or your Postgres port
// });

// app.post('/upload', upload.single('shapefile'), async (req, res) => {
//   try {
//     const fileName = req.file.filename;
//     const filePath = req.file.path;

//     const shp2pgsqlCommand = `shp2pgsql -s ${req.body.schema} -t ${req.body.table} -g ${req.body.geom_column} ${filePath}`;

//     const child = exec(shp2pgsqlCommand);

//     const client = new Client(pool); // Create a new client instance
//     await client.connect(); // Connect to the database

//     const copyStream = client.query(new Client.copyFrom('COPY your_table (columns) FROM STDIN')); // Prepare the copy stream

//     child.stdout.pipe(copyStream); // Pipe shp2pgsql output to the copy stream
//     child.stderr.pipe(process.stderr); // Redirect shp2pgsql errors to console

//     child.on('close', async (code) => {
//       await client.end(); // Close the database connection
//       if (code === 0) {
//         res.json({ message: 'Shapefile uploaded and imported successfully.' });
//       } else {
//         res.status(500).json({ message: 'Error importing shapefile.' });
//       }
//     });

//     child.on('error', (err) => {
//       console.error(err);
//       res.status(500).json({ message: 'Error uploading shapefile.' });
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error.' });
//   }
// });
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
//   });

// app.listen(3000, () => console.log('Server listening on port 3000'));


// -----------------------------------------------

const express = require('express');
const pg = require('pg');
const shp2pgsql = require('shp2pgsql');

const app = express();

// Connect to the PostgreSQL database
const client = new pg.Client({
  host: 'localhost',
  port: 5432,
  database: 'my_database',
  user: 'postgres',
  password: 'password'
});

// Create a new table to store the shapefile data
client.query('CREATE TABLE IF NOT EXISTS shapefile (
  id SERIAL PRIMARY KEY,
  geom geometry
)');

// Convert the shapefile to SQL statements
const sql = shp2pgsql('my_shapefile.shp');

// Execute the SQL statements to create and populate the table
client.query(sql);

// Start the Express application
app.listen(3000, () => {
  console.log('App listening on port 3000');
});
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

app.listen(3000, () => console.log('Server listening on port 3000'));




// Create a new table to store the shapefile data
client.query`('CREATE TABLE IF NOT EXISTS shapefile (
  id SERIAL PRIMARY KEY,
  geom geometry
);`