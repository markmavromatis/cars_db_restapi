import { Router } from 'express';
import { Vehicle } from '../models/Vehicle';
import { VendorFileFormat } from "../models/VendorFileFormat";
import {parseCsvRow} from "../CSVParser";

// var express = require('express');
const multer = require('multer');
const upload = multer();
const router = Router();
const csv = require('csv-parser')
const fs = require('fs')


// Upload file
var uploadFunction = multer({ dest: '/tmp/' }).single('uploadFile');
router.post("/file/:vendorId", async ( req, res ) => {
     uploadFunction(req, res, async function(err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).send({ message: 'uploadFile is a required body parameter' });
        } else {
            // Is a vendor ID provided in the query params?
            let {vendorId} = req.params;
            if (!vendorId) {
                return res.status(400).send({ message: 'vendorId is a required parameter' });
            }
            
            // TODO: Check that a vendor file format is available
            const fileFormat = await VendorFileFormat.findByPk(vendorId);
            if (!fileFormat) {
                return res.status(400).send({ message: `No vendor found with vendorId: ${vendorId}`});
            }
            

            let lineCounter = 0;
            let totalRecordCount = 0;
          
            // Log the CSV file
            let firstRowFields = [];
            let rows = [];
             fs.createReadStream(req.file.path, function(err) {
              console.log("TRAPPED: " + err);
              })
              .pipe(csv())
              .on('data', async (data) => {
                  const aVehicle = parseCsvRow(fileFormat, data)
                  lineCounter += 1;
                  aVehicle.save()
                  // console.log(aVehicle);
              })
              .on('end', () => {


                // // Load records
                // rows.forEach(aRow => {
                //   console.log(aRow);
                //   // parseCsvRow(fileFormat, aRow)
                // });

                return res.status(200).send({message: `Successfully loaded ${lineCounter} records!`})

              })
              .on('error', error => console.error("****" + error))
          
    }
    // Log File in DB.   
    // Parse file
    // Check the format  
    // Log Vehicles in DB
    })
})

export const FileRouter: Router = router;