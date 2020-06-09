import { VendorFileFormat } from "./models/VendorFileFormat";
import { Vehicle } from "./models/Vehicle";
import { IsNumeric } from "sequelize-typescript";
var moment = require("moment");

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
export function parseCsvRow(fileFormat : VendorFileFormat, csvData: string[]) : Vehicle{
    const parsedColumns = fileFormat.columns.split(",")
    const formatColumnsCount = parsedColumns.length;
    const csvColumnsCount = csvData.length
    let newVehicle = new Vehicle();
    if (formatColumnsCount != csvColumnsCount) {
        throw new Error(`Column count (${formatColumnsCount}) does not match CSV field count (${csvColumnsCount})`);
    }
    for (let i = 0; i < formatColumnsCount; i++) {
        const column = parsedColumns[i];
        const csvValue = csvData[i];
        const lowerCaseFieldName = column.toLowerCase();
        let parsedValue = null;
        if (column == "Price") {
            // Validate that the CSV filed is a numeric value.
            if (!isNumber(csvValue)) {
                throw new Error(`Column ${i + 1} (${column}) is not numeric!`)
            } else {
                parsedValue = parseFloat(csvValue);
            }
        } else if (column == "CreateDate" || column == "UpdateDate") {
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
    return newVehicle;
}