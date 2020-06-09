import { Router } from 'express';
import { Vehicle } from '../models/Vehicle';
import { UploadFile } from "../models/UploadFile";
import { Vendor } from "../models/Vendor";
import { VendorFileFormat } from "../models/VendorFileFormat";
import {parseCsvFile} from "../../../CSVParser";
import { UploadFileError } from '../models/UploadFileError';

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

            let {vendorId} = req.params;
            if (!vendorId) {
                return res.status(400).send({ message: 'vendorId is a required parameter' });
            }

            const fileFormat = await VendorFileFormat.findByPk(vendorId);
            if (!fileFormat) {
                return res.status(400).send({ message: `No vendor found with vendorId: ${vendorId}`});
            }

            // const result = parseCsvFile(req.file.path, fileFormat)
            // console.log("FIRST RESULT = " + result)

            parseCsvFile(req.file.path, fileFormat).then(function(result) {
                console.log("RESULTS = " + result)
                return res.status(200).send(result)
            })
            .catch((err) => {
                return res.status(400).send({"result": "Failed"})
            })
                
    }
    // Log File in DB.   
    // Parse file
    // Check the format  
    // Log Vehicles in DB
    })
})

// Retrieve files for a vendor
router.get("/files/:vendorId", async ( req, res ) => {

    // Is a vendor ID provided in the query params?
    let {vendorId} = req.params;
    if (!vendorId) {
        return res.status(400).send({ message: 'vendorId is a required parameter' });
    }

    // Is this a valid vendor?
    let vendor = await Vendor.findByPk(vendorId)
    if (!vendor) {
        return res.status(400).send({ message: `No vendor found with venderId: ${vendorId}` });
    }

    let files = await UploadFile.findAll({
        where: {vendorId: vendorId}
    })

    res.status(200).send(files);

})

// Retrieve files for a vendor
router.get("/fileErrors/:fileId", async ( req, res ) => {

    // Is a vendor ID provided in the query params?
    let {fileId} = req.params;
    if (!fileId) {
        return res.status(400).send({ message: 'fileId is a required parameter' });
    }

    // Is this a valid vendor?
    let uploadFile = await UploadFile.findByPk(fileId)
    if (!uploadFile) {
        return res.status(400).send({ message: `No file found with fileId: ${fileId}` });
    }

    let errors = await UploadFileError.findAll({
        where: {uploadFileId: fileId}
    })

    res.status(200).send(errors);

})


export const FileRouter: Router = router;