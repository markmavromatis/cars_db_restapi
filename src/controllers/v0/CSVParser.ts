import { VendorFileFormat } from "./models/VendorFileFormat";
import { Vehicle } from "./models/Vehicle";
import { IsNumeric } from "sequelize-typescript";
var moment = require("moment");

// Parse CSV row to an instance of a vehicle.
// Validate the field before conversion:
// 1. Count # columns
// 2. Validate Column type
function parseCsvRow(fileFormat : VendorFileFormat, csvData: String[]) : Vehicle{
    const formatColumns = fileFormat.columns.length;
    const csvColumns = csvData.length
    let newVehicle = new Vehicle();
    if (formatColumns != csvColumns) {
        throw new Error(`Column count (${formatColumns}) does not match CSV field count (${csvColumns})`);
    }
    for (let i = 0; i < formatColumns; i++) {
        const column = formatColumns[i];
        const csvValue = csvColumns[i];
        const lowerCaseFieldName = column.toLowerCase();
        let parsedValue = null;
        if (column == "Price") {
            // Validate that the CSV filed is a numeric value.
            if (!csvValue.IsNumeric()) {
                throw new Error(`Column ${i} (${column}) is not numeric!`)
            } else {
                parsedValue = parseFloat(csvValue);
            }
        } else if (column == "CreateDate" || column == "UpdateDate") {
            // Should be a date of format YYYYMMDDHHMMSS
            let dateField = null;
            try {
                dateField = moment(csvValue, "YYYYMMDDHHMMSS")
                parsedValue = dateField
            } catch (e) {
                throw new Error(`Unable to parse ${column} field ${csvValue} into a date`)
            }
        } else {
            parsedValue = csvValue;
        }
        newVehicle[column.toLowerCase()] = parsedValue;
    }
    return newVehicle;
}