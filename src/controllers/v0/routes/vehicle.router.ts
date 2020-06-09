import { Router } from 'express';
import { Vehicle } from '../models/Vehicle';

// var express = require('express');
const router = Router();

// Retrieve vehicles for a vendor
router.get("/vehicles/:vendorId", async ( req, res ) => {

    // Is a vendor ID provided in the query params?
    let {vendorId} = req.params;
    if (!vendorId) {
        return res.status(400).send({ message: 'vendorId is a required parameter' });
    }
    
    let vehicles = (await Vehicle.findAll())
    res.status(200).send(vehicles);

})

export const VehicleRouter: Router = router;