import { Router, Request, Response } from 'express';
import { Vehicle } from '../models/Vehicle';
// import { FeedItem } from '../models/FeedItem';
// import { requireAuth } from '../../users/routes/auth.router';
// import * as AWS from '../../../../aws';

const router: Router = Router();
const multer = require('multer');
const upload = multer({ dest: 'tmp/csv/' });
// const router = new Router();
router.use('/upload-csv', router);

// Upload file
router.post( "/file/:vendorId", upload.single('file'), async ( req, res ) => {

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

export const FileRouter: Router = router;