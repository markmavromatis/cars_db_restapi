// This router contains APIs related to viewing previously uploaded vehicles.

import { Router } from 'express';
import { Vehicle } from '../models/Vehicle';
import { Vendor } from '../models/Vendor';

const router = Router();

// Retrieve all vehicles for a vendor
router.get("/vehicles/:vendorId", async ( req, res ) => {

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

    let vehicles = (await Vehicle.findAll({
        where: {vendorId: vendorId}
    }))

    res.status(200).send(vehicles);

})

export const VehicleRouter: Router = router;