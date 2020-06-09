import { VendorFileFormat } from "./models/VendorFileFormat";
import { Vehicle } from "./models/Vehicle";
import { IsNumeric } from "sequelize-typescript";
import { Vendor } from "./models/Vendor";
import { UploadFile } from "./models/UploadFile";
import { UploadFileError } from "./models/UploadFileError";
import { reject, resolve } from "bluebird";

const csv = require('csv-parser')
const fs = require('fs')
var moment = require("moment");


// Track known column names so that we can skip the others
const KNOWN_COLUMNS = {
    "uuid": {},
    "vin": {},
    "make": {},
    "model": {},
    "mileage": {},
    "year": {},
    "price": {},
    "zipcode": {},
    "createdate": {},
    "updatedate": {}
}

const TIME_FORMAT : string = "YYYYMMDDHHmmss";

// Copied from StackOverflow answer:
// https://stackoverflow.com/questions/23437476/in-typescript-how-to-check-if-a-string-is-numeric
function isNumber(value: string | number): boolean
{
   return ((value != null) &&
           (value !== '') &&
           !isNaN(Number(value.toString())));
}

// Parse CSV row to an instance of a vehicle.
// Validate the field before conversion:
// 1. Count # columns
// 2. Validate Column type
export function parseCsvRow(fileFormat : VendorFileFormat, csvData: { [id: string]: string}) : Vehicle{
    const parsedColumns = fileFormat.columns.split(",")
    const formatColumnsCount = parsedColumns.length;
    const csvColumnsCount = Object.keys(csvData).length
    let newVehicle = new Vehicle();
    if (formatColumnsCount != csvColumnsCount) {
        throw new Error(`Column count (${formatColumnsCount}) does not match CSV field count (${csvColumnsCount})`);
    }
    for (let key in csvData) {

        const column = key;
        const lowerCaseFieldName = column.toLowerCase();
        if (!KNOWN_COLUMNS[lowerCaseFieldName]) {
            // We do not care about this column. Skip...
            continue
        }
        const csvValue = csvData[column];
        let parsedValue = null;
        if (lowerCaseFieldName == "price") {
            // Validate that the CSV filed is a numeric value.
            if (!isNumber(csvValue)) {
                throw new Error(`Column ${column} (${csvValue}) is not numeric!`)
            } else {
                parsedValue = parseFloat(csvValue);
            }
        } else if (lowerCaseFieldName == "createdate" || lowerCaseFieldName == "updatedate") {
            // Should be a date of format YYYYMMDDHHMMSS
            let dateField = null;

            const isValidDate = moment(csvValue, TIME_FORMAT, true).isValid()
            if (!isValidDate) {
                throw new Error(`Unable to parse ${column} field ${csvValue} into a date`)
            }
            dateField = moment(csvValue, TIME_FORMAT);
            parsedValue = dateField
        } else {
            parsedValue = csvValue;
        }
        newVehicle[column.toLowerCase()] = parsedValue;
    }
    newVehicle.vendorId = fileFormat.vendorId;
    return newVehicle;
}

// Parse a CSV file and report the results
export async function parseCsvFile(filePath : string, fileFormat : VendorFileFormat) {
    // throw new Error("TESTING 1-2-3")
    let lineCounter = 0;
    let totalRecordCount = 0;
    const newFile = new UploadFile();
    newFile.filePath = filePath;
    newFile.vendorId = fileFormat.vendorId;
    newFile.uploadSuccessful = false;
    newFile.errors = [];
    // Log the CSV file
    let firstRowFields = [];
    let rows = [];

    const uploadFile = () => new Promise((resolve, reject) => {
        let errors = [];
        fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
            lineCounter += 1;
            try {
                const aVehicle = parseCsvRow(fileFormat, data)
                aVehicle.save()
                // errors.push({"Row": lineCounter, "Message": "Some error"})
            } catch (e) {
                errors.push(e);
            }
        })
        .on('end', () => {
            if (errors.length == 0) {
                newFile.uploadSuccessful = true;
            }

            let fileId = null
            newFile.save().then((result) => {
                fileId = result.id

                let errorCount = errors.length
                if (errorCount == 0) {
                    resolve("No upload errors!");
                } else {
                    errors.forEach((anError) => {
                        const newUploadError = new UploadFileError();
                        newUploadError.uploadFileId = fileId;
                        newUploadError.row = anError.Row;
                        newUploadError.errorMessage = anError.Message;
                        newUploadError.save().then(() => {
                            console.log("\tSaving error...")
                            errorCount -= 1;
                            if (errorCount == 0) {
                                resolve("Final upload error written to DB");
                            }
                        })
                    })
                }
            })
        })
        .on('error', error => console.error("*** CSV Parsing error: " + error))
    })

    await uploadFile()
    // await uploadFile().then((result) => {resolve(result)})
    
    return newFile
}

