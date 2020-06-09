import {parseCsvFile} from '../CSVParser';
import {VendorFileFormat} from '../controllers/v0/models/VendorFileFormat'
import { expect } from 'chai';
import 'mocha';
import { V0MODELS } from '../controllers/v0/model.index';
import { sequelize } from "../sequelize";
import { AssertionError } from 'assert';
import { loadSampleData } from '../SampleDataGenerator';
import { UploadFile } from '../controllers/v0/models/UploadFile';
import { UploadFileError } from '../controllers/v0/models/UploadFileError';
var moment = require("moment");


describe('FileParser Validation Checks', () => {
    before(async function() {
        // Setup tables
        await sequelize.sync().then(async () =>{
            // Load sample data
            await loadSampleData();
          });
    })


    it('should parse a valid CSV file for sample Vendor A with no errors', async () => {
        const fileFormat = await VendorFileFormat.findByPk("A");
        const filePath = __dirname + "/csv-files/Valid5Records.csv"
        parseCsvFile(filePath, fileFormat).then(result => {
            expect(result.uploadSuccessful).to.equal(true);
        })
    })

    it('should parse an invalid CSV file for sample Vendor A with 1 error', async () => {
        const fileFormat = await VendorFileFormat.findByPk("A");
        const filePath = __dirname + "/csv-files/Valid4Invalid1Records.csv"
        let fileId = null
        await parseCsvFile(filePath, fileFormat).then(result => {
            fileId = result.id;
        })
        

        const result = await UploadFile.findByPk(fileId, {
            include: [{
              model: UploadFileError
            }]});

        // Test that the file record shows an unsuccessful load with error messages
        expect(result.uploadSuccessful).to.equal(false);
        expect(result.errors.length).to.equal(1);
        const errorRecord = result.errors[0];
        expect(errorRecord.errorMessage).to.equal("Column count (4) does not match CSV field count (3)");
        expect(errorRecord.row).to.equal(5);
})


})
