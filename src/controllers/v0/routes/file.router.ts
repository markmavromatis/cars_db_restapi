// This router contains APIs related to uploading and viewing previously uploaded file 
// records / parsing errors.

import { Router } from 'express';
import { UploadFile } from "../models/UploadFile";
import { Vendor } from "../models/Vendor";
import { VendorFileFormat } from "../models/VendorFileFormat";
import { parseCsvFile } from "../../../CSVParser";
import { UploadFileError } from '../models/UploadFileError';

const multer = require('multer');
const router = Router();

// Upload a vehicles list file to the service
var uploadFunction = multer({ dest: '/tmp/' }).single('uploadFile');
router.post("/files/:vendorId", async ( req, res ) => {
     uploadFunction(req, res, async function(err) {
        if (err instanceof multer.MulterError) {
            // Handle errors when a user does not attach a file to the correct field.
            return res.status(400).send({ message: 'uploadFile is a required body parameter' });
        } else {
            // File received. Check for valid vendor ID
            let {vendorId} = req.params;
            if (!vendorId) {
                return res.status(400).send({ message: 'vendorId is a required parameter' });
            }

            const fileFormat = await VendorFileFormat.findByPk(vendorId);
            if (!fileFormat) {
                return res.status(400).send({ message: `No vendor found with vendorId: ${vendorId}`});
            }

            // Vendor format found. Proceed to parsing the file.
            parseCsvFile(req.file.path, fileFormat).then(function(result) {
                // File successfully parsed. Return results to the caller.
                return res.status(200).send(result)
            })
            .catch((err) => {
                // Error encountered preventing file upload.
                return res.status(500).send({"result": err})
            })            
        }
    })
})

// Retrieve previously uploaded file logs for a vendor
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

    // Return list of file log records to the client.
    res.status(200).send(files);

})

// Retrieve file parsing errors for a specific file
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