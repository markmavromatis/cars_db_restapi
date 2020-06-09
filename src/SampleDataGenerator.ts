import {Vendor} from './controllers/v0/models/Vendor'
import {VendorFileFormat} from './controllers/v0/models/VendorFileFormat'

export async function loadSampleData() {

    // const SAMPLE_VENDORS : Vendor[] = [
    //     new Vendor({vendorId: "A", vendorName: "Audi Dealer A"}),
    //     new Vendor({vendorId: "B", vendorName: "Buick Dealer B"})
    // ]
    // SAMPLE_VENDORS.forEach(async aVendor => {await aVendor.save()})
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

