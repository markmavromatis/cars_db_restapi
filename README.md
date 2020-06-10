# Cars DB RestAPI
This RestAPI service is a Proof of Concept project which supports vendors (i.e. car dealerships) registering and reviewing their inventory. Each dealership, or provider, registers a CSV file format for uploading vehicles.

Vendors upload CSV files containing tens, hundreds, or thousands of vehicles. The system supports multiple vehicle attributes including:

- uuid - A unique ID that the dealership uses to track the vehicle
- VIN - Unique Vehicle Identification Number
- Make - Vehicle Maker
- Model - Vehicle Model
- Year - Model Year
- Price - Vehicle Price
- ZipCode - Zipcode location of vehicle
- CreateDate - Date that the vehicle was added to the dealership inventory
- UpdateDate - Date that the vehicle was updated in the dealership inventory

Vendors are assigned a CSV format (stored in a database table) that they use to generate lists of vehicles to upload into the system. Columns may include fields that are not in the above list. These columns will be ignored.

If there are errors parsing a file, clients can re-upload the files and not worry about duplicate records. The VendorId and UUID are checked for each uploaded vehicle. If there is a match with an existing record, the existing record is overwritten with the updated record. This way, if clients witness CSV parsing errors on individual rows in their vehicle files, they can fix the issues and re-upload the file to process the dropped records. 

## Installation

This project is implemented using NodeJS and Express. The web server should run on any UNIX system with NodeJS and NPM installed.

To run a development instance, clone this project into a local folder and run a dev server as follows:

1. Install NPM dependencies: ```npm install```
2. Start up the dev server: ```npm run dev```

## NPM Modules

The project is built using several well known Node packages including:

- Express - Lightweight web server for hosting rest APIs
- Moment - Date library
- Multer - Handles file uploads
- Sequelize - Object Relational Mapping utility enabling database access without direct SQL queries
- SQL Lite - In-memory relational database
- Mocha / Chai - These libraries enable unit tests

## Database

This project uses an in-memory database (SQL Lite) to store dealership information, vehicle, and file upload history. There are five tables used in this application:

1. UploadFiles - Each file upload is recorded in the system. Tracked attributes include file upload time and uploaded result (status).
2. UploadFileErrors - Errors identified during each file upload are stored here. Attributes include row # and error message.
3. Vehicles - Vehicles, their attributes, and associated dealer are tracked in this table.
4. Vendors - Each dealership and their vendorId is tracked in this table.
5. VendorFileFormat - The preferred CSV column layout for each dealership is stored in this table.

## Sample Data

The repo includes three example dealerships with their own file formats. 
|VendorId|FileFormat|
|---|---|
|A|uuid,vin,make,model|
|B|vin,uuid,make,model,price|
|C|uuid,vin,make,model,year,mileage,price,zipcode,createdate,updatedate|

CSVFiles can be uploaded for each of these vendors based on the file formats. See the test/ folder for some samples.

## File Storage

All uploaded files are currently stored in the /tmp/ folder of the web server.

## Endpoints

There are 5 endpoints included in this project:

- (GET) http://{{host}} - This endpoint takes no arguments and returns a message if the server is up.
- (POST) http://{{host}}/api/v0/files/:VendorID - This endpoint will upload a CSV file (specified in a form data "uploadFile" field) to the server and parse / register its vehicle records. It will return the status of the upload and whether all records were processed.
- (GET) http://{{host}}/api/v0/files/:VendorID - This endpoint returns a list of files (including attributes like creation time, status, and server path) that have been uploaded by a dealer.
- (GET) http://{{host}}/api/v0/fileErrors/:FileID - This endpoint returns a list of parse errors (if applicable) for a specific file.
- (GET) http://{{host}}/api/v0/vehicles/:VendorID - This endpoint returns all vehicles associated with a VendorID.

## Example endpoint responses

### Uploading a file for vendor 'A'

(POST) http://{{host}}/api/v0/files/A

```
{
    "id": 3,
    "autofiCreatedAt": "2020-06-10T02:24:04.416Z",
    "autofiUpdatedAt": "2020-06-10T02:24:04.419Z",
    "filePath": "/tmp/4ace84971412c26ca91b6ba6974543b6",
    "vendorId": "A",
    "uploadSuccessful": false
}
```

### Retrieve vehicles for a vendor 'A'

http://{{host}}/api/v0/vehicles/A

```
[
    {
        "id": 1,
        "uuid": "1",
        "vin": "D1231414",
        "make": "Chevrolet",
        "model": "Bolt",
        "mileage": null,
        "year": null,
        "price": null,
        "vendorId": "A",
        "createdate": null,
        "updatedate": null,
        "autofiCreatedAt": "2020-06-09T21:09:59.129Z",
        "autofiUpdatedAt": "2020-06-09T21:09:59.142Z"
    },
    {
        "id": 2,
        "uuid": "2",
        "vin": "D1231415",
        "make": "Cadillac",
        "model": "STS",
        "mileage": null,
        "year": null,
        "price": null,
        "vendorId": "A",
        "createdate": null,
        "updatedate": null,
        "autofiCreatedAt": "2020-06-09T21:09:59.130Z",
        "autofiUpdatedAt": "2020-06-09T21:09:59.143Z"
    }
]
```

### Retrieve file upload history for a vendor "A"

http://{{host}}/api/v0/files/A

```
    {
        "id": 3,
        "filePath": "/tmp/c56c2ea38c78f8969131eb5dc8d2d337",
        "vendorId": "A",
        "uploadSuccessful": false,
        "autofiCreatedAt": "2020-06-10T02:26:30.018Z",
        "autofiUpdatedAt": "2020-06-10T02:26:30.018Z"
    }
```

### Retrieve file upload errors for file #3

http://{{host}}/api/v0/fileErrors/3

```
[
    {
        "id": 1,
        "uploadFileId": 3,
        "row": 1,
        "errorMessage": "Column count (4) does not match CSV field count (3)",
        "autofiCreatedAt": "2020-06-10T02:26:30.021Z",
        "autofiUpdatedAt": "2020-06-10T02:26:30.021Z"
    }
]
```


## Tests

This project includes Mocha/Chai tests for the CSV (row) parser and the File parser.


## License

This project is freely distributed under the MIT license.
