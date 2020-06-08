import { sequelize } from "./sequelize";

// const { Sequelize } = import ./sequelize;

const express = require('express')
const multer = require('multer');
const Router = express.Router;

// (async () => {


  const app = express()
  const router = new Router();
  const port = 3000;

  app.get( "/", async ( req, res ) => {

    // Instantiate SQL Lite database
    res.send('Hello World!')
  });


  app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
// })