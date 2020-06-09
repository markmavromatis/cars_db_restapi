import {parseCsvRow} from '../controllers/v0/CSVParser';
import {VendorFileFormat} from '../controllers/v0/models/VendorFileFormat'
import { expect } from 'chai';
import 'mocha';
import { V0MODELS } from '../controllers/v0/model.index';
import { sequelize } from "../sequelize";
var moment = require("moment");

sequelize.addModels(V0MODELS);

describe('CSVParser Validation Checks', () => {
    it('should throw error for column mismatch', () => {

        const fileFormat = new VendorFileFormat({
            columns: "Price,CreateDate,Model",
            vendorId: "ABC"
        })
        // fileFormat.columns = "Price,CreateDate,Model";
        // const fileFormat = {"columns": "Price,CreateDate,Model"};
        const csvColumns = ["5", "2"];
        const fileFormatColCount = fileFormat.columns.split(",").length;
        const csvColCount = csvColumns.length;
        const expectedError = `Column count (${fileFormatColCount}) does not match CSV field count (${csvColCount})`;
    
        expect(()=>{ parseCsvRow(fileFormat, csvColumns) }).to.throw(expectedError);
    });

    it('should throw error for numeric (Price) field mismatch', () => {

        const fileFormat = new VendorFileFormat({
            columns: "Price,Model",
            vendorId: "ABC"
        })
        const csvColumns = ["ABC", "2"];
        const expectedError = `Column 1 (Price) is not numeric!`;
    
        expect(()=>{ parseCsvRow(fileFormat, csvColumns) }).to.throw(expectedError);
    });

    it('should throw error for date (CreateDate) field mismatch', () => {

        const fileFormat = new VendorFileFormat({
            columns: "Price,CreateDate",
            vendorId: "ABC"
        })
        const csvColumns = ["123", "456"];
        const expectedError = `Unable to parse CreateDate field 456 into a date`;
            
        expect(()=>{ parseCsvRow(fileFormat, csvColumns) }).to.throw(expectedError);
    });

    it('should convert a valid CSV record to a Vehicle record', () => {

        const fileFormat = new VendorFileFormat({
            columns: "Make,Model,Price,CreateDate",
            vendorId: "ABC"
        })
        const csvColumns = ["Chevrolet", "Bolt", "30000", "20200601140000"];
        const result = parseCsvRow(fileFormat, csvColumns);
        expect(result.make).to.equal("Chevrolet");
        expect(result.model).to.equal("Bolt");
        expect(result.price).to.equal(30000);
        // expect(result.).to.equal(30000);
    });

})
