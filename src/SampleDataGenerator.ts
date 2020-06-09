import {Vendor} from './controllers/v0/models/Vendor'
import {VendorFileFormat} from './controllers/v0/models/VendorFileFormat'

// Create some vendors and vendor formats.
export async function loadSampleData() {

    Vendor.bulkCreate([
        {"vendorId": "A", "vendorName": "Audi Dealer A"},
        {"vendorId": "B", "vendorName": "Buick Dealer B"}
    ]).then(() =>{
        VendorFileFormat.bulkCreate([
            {"vendorId": "A", "columns": "uuid, vin, make, model"},
            {"vendorId": "B", "columns": "vin, uuid, make, model, price"}
        ]).then(() => {
            console.log("Load Sample Data DONE")
        })
        
    })
}

