/* adding the required modules*/
const fs = require('fs'); 
const jmespath = require('jmespath');
const express = require('express');
const upload = require('express-fileupload');
const path = require('path');

const server = express(); //creating a new express application
server.use(upload()); //this is the middleware connected to express file upload

/* Get request is made to the server at the root path, and the application is responding by loading the index.html */ 
server.get('/', (req, res) =>
{
    res.sendFile(__dirname + '/index.html');
})

/* Application starts the server at port 5000 */
server.listen(5000, () => 
{
    console.log("Application is running at http://localhost:5000/");
})

/* Post request connected to the file upload and file selecting */
server.post('/', (req, res) => 
{
    if(req.files) //we will chekc if the request.file is initialized or not
    {    
    console.log(req.files); //we are outputting to the terminal information that is created when the file is uploaded
    var file = req.files.fileName; //file object will acquired, the "filename" part is connected to the index.html line 35, please look at the name part to the right
    var filename = file.name; //file name will be extracted
    filename = 'data.json'; //file name is changed, files with a different name will also have this name when they are stored in the "InputJSON" folder
    console.log(filename); //we are outputting the filename at terminal, which should be data.json
    
    //We are moving the file to upload folder which for this application is "InputJSON"
    file.mv('./InputJSON/' + filename, function (err)
    {
    if (err) //errors
    {
       res.send(err); 
    }
    else //no errors
    {
        OutputJSONClear(); //calling the function that will clear the output folder before the new upload        
        setTimeout(() => //There will be a 5 second delay before the code inside the arrow function are executed
        {
            res.send("File Uploaded"); //File uploaded reponse will be sent by the application
            UpdateJSON(); //calling the funciton update to update the JSON file this include storing the updated the JSON file
        }, 5000); //1000 ms = 1 s
    }
    })
    }
})

//Function to clear the input folder "InputJSON"
function InputJSONClear()
{
    const directory = 'InputJSON';

    fs.readdir(directory, (err, files) =>
    {
        if (err) throw err;

        for (const file of files)
        {
            fs.unlink(path.join(directory, file), err =>
            {
                if (err) throw err;
            });
        }
    });
}

//Function to clear output folder "OutputJSON"
function OutputJSONClear()
{
    const directory = "OutputJSON";
    
    fs.readdir(directory, (err, files) => 
    {
        if (err) throw err;

        for (const file of files)
        {
            fs.unlink(path.join(directory, file), err => 
            {
                if (err) throw err;
            });
        }
    });
}

//Get request connected to the download button and downloading the the output/update JSON file
server.get('/download', function(req, res) 
{
    const downloadfile = `${__dirname}/OutputJSON/assetlist.json`;
    res.download(downloadfile);
})

//Updating the JSON File
function UpdateJSON()
{
var ReadJSON = fs.readFileSync('./InputJSON/data.json'); //reading from the data.json and storing in a variable
var ParseJSON = JSON.parse(ReadJSON); //coverting the json to javascript object

//Updating the JSON File with the jmespath query language sorting the measurment by MeasurementTypeID
var Output1 = jmespath.search(ParseJSON,
    `[].
{
    AssetID: AssetID,
    UniqueID: UniqueID,
    DeviceID: DeviceID,
    AssetName: AssetName,
    SerialNumber: SerialNumber,
    Description: Description,
    PlantID: PlantID,
    PlantName: PlantName,
    AssetGroupID: AssetGroupID,
    AssetType: AssetType,
    SensorType: SensorType,
    AssetTypeName: AssetTypeName,
    IsFavorite: IsFavorite,
    FirmwareUpdate:
    {
        UpdateAvailable: UpdateAvailable,
        UpdateFirmwareID: UpdateFirmwareID,
        UpdateFirmwareVersion:  UpdateFirmwareVersion,
        UpdateFirmwareProperties: UpdateFirmwareProperties
    },
    BatteryLevel: BatteryLevel,
    HealthStatus: HealthStatus,
    LastSyncTimeStamp: LastSyncTimeStamp,
    LastMeasurementTimeStamp: LastMeasurementTimeStamp,
    AssetProperties: AssetProperties[],
    Measurements : sort_by(Measurements, &MeasurementTypeID)[],
    Sensor:
    {
        SensorIdentifier: SensorIdentifier,
        Hardware:
        {
           HardwareRevisionID: HardwareRevisionID,
           HardwareRevisionName: HardwareRevisionName,
           HardwareVarianceID: HardwareVarianceID,
           HardwareVarianceName: HardwareVarianceName
        },  
        FirmwareVersion: FirmwareVersion,
        CommissioningDate: CommissioningDate,
        Properties: Properties[],
        Subscription:
        {
            IsBasicSubscription: IsBasicSubscription,
            IsTrialSubscription: IsTrialSubscription,
            StartDate: StartDate,
            EndDate: EndDate,
            SubscriptionLevel:
            {
               Description: Description,
               Id: Id,
               Name: Name
            },
            HasAvailableSubscriptions: HasAvailableSubscriptions,
            IsExpiring: IsExpiring
        },
        Features: Features[]
        IsPowerSavingEnabled: IsPowerSavingEnabled,
        OperatingMode:  OperatingMode    
    },
    LocationLatitude: LocationLatitude,
    LocationLongitude: LocationLongitude,
    CreatedOn: CreatedOn,
    LastUpdatedOn: LastUpdatedOn,
    OrganizationID: OrganizationID,
    ConfigurationProfiles:[],
    AssetResponsibleID: AssetResponsibleID,
    AssetResponsibleName: AssetResponsibleName,
    IsMonitored: IsMonitored,
    AuthenticationPassKey: AuthenticationPassKey,
    AuthenticationID: AuthenticationID,
    FirmwareVersion: FirmwareVersion
    SensorTypeKey:
    {
        SensorType: SensorType,
        AssetType: AssetType
    }
}
`
)
console.log(Output1); //outputting the update JSON file
fs.writeFileSync('./OutputJSON/assetlist.json', JSON.stringify(Output1, null, 2)); //storing the the JSON file to OutputJSON folder

var ReadJSON2 = fs.readFileSync('./OutputJSON/assetlist.json'); //reading from the data.json and storing in a variable
var ParseJSON2 = JSON.parse(ReadJSON2); //coverting the json to javascript object

//Updating the JSON File with the jmespath query language, this one is selecting specific MeasurementTypeCode
var Output2 = jmespath.search(ParseJSON2, 
    `[].
{
    AssetID: AssetID,
    UniqueID: UniqueID,
    DeviceID: DeviceID,
    AssetName: AssetName,
    SerialNumber: SerialNumber,
    Description: Description,
    PlantID: PlantID,
    PlantName: PlantName,
    AssetGroupID: AssetGroupID,
    AssetType: AssetType,
    SensorType: SensorType,
    AssetTypeName: AssetTypeName,
    IsFavorite: IsFavorite,
    FirmwareUpdate:
    {
        UpdateAvailable: UpdateAvailable,
        UpdateFirmwareID: UpdateFirmwareID,
        UpdateFirmwareVersion:  UpdateFirmwareVersion,
        UpdateFirmwareProperties: UpdateFirmwareProperties
    },
    BatteryLevel: BatteryLevel,
    HealthStatus: HealthStatus,
    LastSyncTimeStamp: LastSyncTimeStamp,
    LastMeasurementTimeStamp: LastMeasurementTimeStamp,
    AssetProperties: AssetProperties[],
    Measurements : Measurements[?contains(['Speed', 'SkinTemp', 'OverallVibration', 'LineFrequency', 'BearingCondition', 'Acc_z' , 'Acc_y', 'Acc_x', 'EnergyConsumption', 'MotorStartStopCount', 'PeakToPeak_X_Motor', 'PeakToPeak_Y_Motor', 'PeakToPeak_Z_Motor', 'Bearing_x_Motor', 'Bearing_y_Motor', 'Bearing_z_Motor', 'Motor_TotalRunningTime'], MeasurementTypeCode)],
    Sensor:
    {
        SensorIdentifier: SensorIdentifier,
        Hardware:
        {
           HardwareRevisionID: HardwareRevisionID,
           HardwareRevisionName: HardwareRevisionName,
           HardwareVarianceID: HardwareVarianceID,
           HardwareVarianceName: HardwareVarianceName
        },  
        FirmwareVersion: FirmwareVersion,
        CommissioningDate: CommissioningDate,
        Properties: Properties[],
        Subscription:
        {
            IsBasicSubscription: IsBasicSubscription,
            IsTrialSubscription: IsTrialSubscription,
            StartDate: StartDate,
            EndDate: EndDate,
            SubscriptionLevel:
            {
               Description: Description,
               Id: Id,
               Name: Name
            },
            HasAvailableSubscriptions: HasAvailableSubscriptions,
            IsExpiring: IsExpiring
        },
        Features: Features[]
        IsPowerSavingEnabled: IsPowerSavingEnabled,
        OperatingMode:  OperatingMode    
    },
    LocationLatitude: LocationLatitude,
    LocationLongitude: LocationLongitude,
    CreatedOn: CreatedOn,
    LastUpdatedOn: LastUpdatedOn,
    OrganizationID: OrganizationID,
    ConfigurationProfiles:[],
    AssetResponsibleID: AssetResponsibleID,
    AssetResponsibleName: AssetResponsibleName,
    IsMonitored: IsMonitored,
    AuthenticationPassKey: AuthenticationPassKey,
    AuthenticationID: AuthenticationID,
    FirmwareVersion: FirmwareVersion
    SensorTypeKey:
    {
        SensorType: SensorType,
        AssetType: AssetType
    }
}
`
)
console.log(Output2); 
fs.writeFileSync('./OutputJSON/assetlist.json', JSON.stringify(Output2, null, 2));

}


/*
Reference:
Many Websites are not part of the reference but helped, Thanks to those websites also
https://jsonformatter.curiousconcept.com/#
https://www.geeksforgeeks.org/how-to-filter-nested-objects-in-javascript/
https://stackoverflow.com/questions/11922383/how-can-i-access-and-process-nested-objects-arrays-or-json/11922384
https://stackoverflow.com/questions/40537990/removing-json-object-from-json-file
https://www.w3schools.com/js/default.asp
https://www.tutorialspoint.com/json/json_syntax.htm
https://www.freecodecamp.org/news/javascript-array-of-objects-tutorial-how-to-create-update-and-loop-through-objects-using-js-array-methods/
https://stackoverflow.com/questions/29140301/access-array-inside-an-object
https://www.youtube.com/watch?v=pnPeVzZ2Dbo&ab_channel=NazmusNasir
https://www.easyprogramming.net/javascript/recursive_nested_json_function.php
https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON
https://docs.jsonata.org/construction
https://levelup.gitconnected.com/json-queries-give-your-users-jmespath-power-ef8ab0d38553   
https://www.npmjs.com/package/jsonpath   
https://jmespath.org/
https://www.baeldung.com/guide-to-jayway-jsonpath
https://github.com/dchester/jsonpath#readme
https://github.com/auditassistant/json-query
https://www.npmjs.com/package/jmespath
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Unterminated_string_literal
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
https://stackoverflow.com/questions/37945318/jmespath-json-filter-with-multiple-matches
https://www.sisense.com/blog/empower-users-with-jmespath-for-json-queries/
https://programmingwithmosh.com/javascript/react-file-upload-proper-server-side-nodejs-easy/
https://reactjs.org/
https://www.w3schools.com/bootstrap4/bootstrap_forms_custom.asp
https://getbootstrap.com/docs/5.1/getting-started/introduction/
https://medium.com/zero-equals-false/how-to-connect-a-react-frontend-with-node-js-bccb1fb7e2bb
https://www.freecodecamp.org/news/create-a-react-frontend-a-node-express-backend-and-connect-them-together-c5798926047c/
https://www.quora.com/After-I-created-a-project-using-a-create-react-app-how-can-I-delete-it-from-my-computer
https://w3collective.com/react-file-upload-node-js/
https://medium.com/@jamischarles/what-is-middleware-a-simple-explanation-bb22d6b41d01
https://medium.com/@SilentHackz/file-upload-with-node-react-d405b8a4fab8
https://www.google.ca/search?q=connect+node+js+backend+to+frontend&sxsrf=AOaemvKvI_r1MIu5CVvLmcKazYKjdAAW5w%3A1633533424179&ei=8L1dYde0Cpix0PEP-Y6GuAU&oq=connect+node+js+backend+to+frontend&gs_lcp=Cgdnd3Mtd2l6EAMYADIECCMQJzIECCMQJzIECCMQJzIFCAAQkQIyBAgAEEMyBQgAEJECMgQIABBDMgQIABBDMgQIABBDMhEILhCABBCxAxCDARDHARCjAjoHCCMQ6gIQJzoKCC4QxwEQ0QMQQzoLCAAQgAQQsQMQgwE6DgguEIAEELEDEMcBEKMCOg4ILhCABBCxAxDHARDRAzoICAAQgAQQsQM6CAguELEDEIMBOgUIABCABDoRCC4QgAQQsQMQgwEQxwEQ0QM6CwguEIAEELEDEIMBOggIABCxAxCDAToKCAAQsQMQgwEQQzoHCAAQsQMQQzoKCAAQgAQQhwIQFDoICAAQgAQQyQNKBAhBGABQzuIEWMHABWDVygVoEXACeACAAY4BiAH9DpIBBDE0LjaYAQCgAQGwAQrAAQE&sclient=gws-wiz    
https://codingshiksha.com/tutorials/how-to-upload-files-to-node-js-express-server-using-express-fileupload-library/
https://www.youtube.com/watch?v=ymO_r1hcIXk&ab_channel=CodingShiksha
https://stackoverflow.com/questions/7288814/download-a-file-from-nodejs-server-using-express
https://stackoverflow.com/questions/2906582/how-to-create-an-html-button-that-acts-like-a-link
https://stackoverflow.com/questions/56611124/button-to-download-a-document-implemented-with-express-js-and-node-js-isnt-work
https://www.w3docs.com/learn-html/html-spacer-tag.html
https://stackoverflow.com/questions/9114664/spacing-between-elements
https://lazaroibanez.com/difference-between-the-http-requests-post-and-get-3b4ed40164c1
https://stackoverflow.com/questions/27072866/how-to-remove-all-files-from-directory-without-removing-directory-in-node-js/49125621
https://stackoverflow.com/questions/64330693/how-to-rename-file-while-using-express-fileupload-in-node-js
https://www.w3schools.com/html/default.asp
https://www.w3schools.com/jsref/met_win_settimeout.asp
https://stackoverflow.com/questions/17883692/how-to-set-time-delay-in-javascript
https://positive-stud.medium.com/how-to-make-your-public-repository-as-private-and-vice-versa-in-github-39bd2dbfe0ff
https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility
https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files
https://stackoverflow.com/questions/1947263/using-an-html-button-to-call-a-javascript-function
https://expressjs.com/en/starter/hello-world.html
https://www.coursereport.com/blog/what-is-express
https://www.sohamkamani.com/blog/2018/05/30/understanding-how-expressjs-works/
*/

