import { sequelize } from "./sequelize";
import { V0MODELS } from './controllers/v0/model.index';
import { loadSampleData } from "./SampleDataGenerator";
import { FileRouter } from './controllers/v0/routes/file.router';
import { VehicleRouter } from './controllers/v0/routes/vehicle.router';
require("./SampleDataGenerator");

const express = require('express')

// Load table definitions into database
sequelize.addModels(V0MODELS);
sequelize.sync().then(() =>{
  // Load sample data
  loadSampleData();
});

const app = express()
const port = process.env.PORT || 3000; // default port to listen

app.get( "/", async ( req, res ) => {
  res.send('Server is up!')
});

app.use('/api/v0/', FileRouter)
app.use('/api/v0/', VehicleRouter)

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
