import { Router } from 'express';
import { Vehicle } from '../models/Vehicle';

// var express = require('express');
const multer = require('multer');
const upload = multer();
const router = Router();
const csv = require('csv-parser')
const fs = require('fs')


// Upload file
var uploadFunction = multer({ dest: '/tmp/' }).single('uploadFile');
router.post("/file/:vendorId", async ( req, res ) => {
    uploadFunction(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).send({ message: 'uploadFile is a required body parameter' });
        } else {
            // Is a vendor ID provided in the query params?
            let {vendorId} = req.params;
            if (!vendorId) {
            return res.status(400).send({ message: 'vendorId is a required parameter' });
            }
            
            // TODO: Check that a vendor file format is available
        
            // Is a file included in the payload?
            console.log("REQ.files = " + req.file);

        // Log the CSV file
        fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => {
            console.log(data)
        })
        .on('end', () => {
            console.log("DONE");
        });

    }
    // Log File in DB.   
    // Parse file
    // Check the format  
    // Log Vehicles in DB
    })
})

export const FileRouter: Router = router;