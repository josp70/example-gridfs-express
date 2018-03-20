/* eslint no-process-env: "off" */
/* eslint no-prototype-builtins: "off" */

const express = require('express');
const mongodb = require('mongodb');
const bodyParser = require('body-parser');
const expressListRoutes = require('express-list-routes');
const gridfs = require('gridfs-express');
const Boom = require('boom');

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gridfs_test';
const portDefault = 3000;
const portService = process.env.PORT || portDefault;

let db = null;

const app = express();

const routerAPI = new express.Router();

// to extract metadata from body, required in PATCH /api/gridfs/v1
app.use(bodyParser.json());

// mount routerAPI on /api/gridfs/v1
app.use('/api/gridfs/v1', routerAPI);

// this does not work with mongo >= 3.x
mongodb.MongoClient.connect(mongoURI, (err, database) => {
  if (err) {
    throw err;
  }

  db = database;
  // Start the application after the database connection is ready
  app.listen(portService, () => {
    console.log(`server listen on ${portService}`);
    // list the end-points available
    expressListRoutes({prefix: '/api/gridfs/v1'}, 'API:', routerAPI);
  });
});

gridfs(routerAPI, {
  getDb: () => db,
  getKeyMetadata: (req) => {
    const missing = [
      'name',
      'family',
      'ref'
    ].filter((param) => !req.query.hasOwnProperty(param));

    if (missing.length) {
      throw Boom.badRequest('required query parameter', {parameters: missing});
    }
    return {
      name: req.query.name,
      family: req.query.family,
      ref: req.query.ref
   };
  },
  getOtherMetadata: (req) => req.body
});


