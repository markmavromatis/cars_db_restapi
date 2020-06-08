import { sequelize } from "./sequelize";
import { V0MODELS } from './controllers/v0/model.index';
import { Vehicle } from './controllers/v0/models/Vehicle';
import { loadSampleData } from "./SampleDataGenerator";
require("./SampleDataGenerator");

const express = require('express')
const multer = require('multer');
const Router = express.Router;

// Load table definitions into database
sequelize.addModels(V0MODELS);
sequelize.sync().then(() =>{
  // Load sample data
  loadSampleData();
});

const upload = multer({ dest: 'tmp/csv/' });
const app = express()
const router = new Router();
const port = 3000;
app.use('/upload-csv', router);

app.get( "/", async ( req, res ) => {

  // Instantiate SQL Lite database
  res.send('Server is up!')
});

// Upload file
app.post( "/file/:vendorId", upload.single('file'), async ( req, res ) => {

  // Is a vendor ID provided in the query params?
  let {vendorId} = req.params;
  if (!vendorId) {
    return res.status(400).send({ message: 'vendorId is a required parameter' });
  }
  
  // TODO: Check that a vendor file format is available

  // Is a file included in the payload?
  if (!req.File) {
    return res.status(400).send({ message: 'CSV file required in request body' });
  }

  // Log File in DB. 

  // Parse file
  // Check the format

  // Log Vehicles in DB

  const newVehicle = await new Vehicle({
    uuid: "123",
    vin: "456"
  });
  const savedVehicle = await newVehicle.save();
  res.status(201).send(savedVehicle);
})


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
