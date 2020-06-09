import {Vendor} from './controllers/v0/models/Vendor'
import {VendorFileFormat} from './controllers/v0/models/VendorFileFormat'

export function loadSampleData() {

    const SAMPLE_VENDORS : Vendor[] = [
        new Vendor({vendorId: "A", vendorName: "Audi Dealer A"}),
        new Vendor({vendorId: "B", vendorName: "Buick Dealer B"})
    ]
    SAMPLE_VENDORS.forEach(aVendor => {aVendor.save()})

    const SAMPLE_VENDOR_FORMATS : VendorFileFormat[] = [
        new VendorFileFormat({vendorId: "A", columns: "uuid, vin, make, model"}),
        new VendorFileFormat({vendorId: "B", columns: "vin, uuid, make, model, price"})
    ]
    SAMPLE_VENDOR_FORMATS.forEach(aVendorFormat => {aVendorFormat.save()})

}

