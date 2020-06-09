import { VendorFileFormat } from "./models/VendorFileFormat";
import { Vehicle } from "./models/Vehicle";
import { IsNumeric } from "sequelize-typescript";

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
        console.log("KEY = " + key);
        const column = key;
        const lowerCaseFieldName = column.toLowerCase();
        if (!KNOWN_COLUMNS[lowerCaseFieldName]) {
            // We do not care about this column. Skip...
            console.log("SKIPPING FIELD: " + lowerCaseFieldName);
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
            console.log("ELSE: " + lowerCaseFieldName);
            console.log("PARSED: " + csvValue);
        }
        console.log("PARSED VALUE = " + parsedValue)
        console.log("**** Setting field " + column.toLowerCase() + " to " + parsedValue);
        newVehicle[column.toLowerCase()] = parsedValue;
    }
    return newVehicle;
}

// // Parse a CSV file and return the results
// // {success: true/false, rowsAdded: x}
// export async function processCsvFile(fileFormat: VendorFileFormat, csvFilePath : string) {



//     // parseCsvRow(fileFormat, data);
//   rows.forEach(row => console.log(row));
    
//   //   // Parse first line
//   //        // Check file format: <RecordCount>
//   //        if (data.length != 1) {
//   //         throw new Error("File Parse Error: First row in file should contain the Record Count!")
//   //  parseCsvRow(fileFormat, data);

// }