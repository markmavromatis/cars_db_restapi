import {VendorFileFormat} from './controllers/v0/models/VendorFileFormat'

export function loadSampleData() {
    const SAMPLE_VENDORS : VendorFileFormat[] = [
        new VendorFileFormat({vendorId: "A", columns: "uuid, vin, make, model"}),
        new VendorFileFormat({vendorId: "B", columns: "vin, uuid, make, model, price"})
    ]
    SAMPLE_VENDORS.forEach(aVendor => {aVendor.save()})

}

