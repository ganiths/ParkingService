// get parking slots
require("../config/config.js");

const { DefaultAzureCredential } = require("@azure/identity");
const { DigitalTwinsClient } = require("@azure/digital-twins-core");

const CosmosClient = require("@azure/cosmos").CosmosClient;
const endpoint = process.env.endpoint || global.gConfig.endpoint;
const digitalTwinsUrl = process.env.digitalTwinsUrl || global.gConfig.digitalTwinsUrl;
const key = process.env.key || global.gConfig.key;
const client = new CosmosClient({ endpoint, key });

const database = client.database(global.gConfig.databaseId);
const container = database.container(global.gConfig.containerId);

exports.getParkingSlots = async (req, res) => {
    try {
        const latitude = parseFloat(req.query.latitude);
        const longitude = parseFloat(req.query.longitude);

        if (!isNaN(latitude) && !isNaN(longitude)) {

            var locationFilter = {

                "type": "Point",
                "coordinates": [latitude, longitude]
            }
            const city = 'Edinburgh';

            const querySpec = {
                query: "SELECT * from c where c.city=@city and ST_DISTANCE(c.location, @locationfilter) < 5000",
                parameters: [{ name: "@city", value: city }, { name: "@locationfilter", value: locationFilter }]
            };
            const { resources: items } = await container.items
                .query(querySpec)
                .fetchAll();
            console.log(items.item);
            res.json({
                items,
            });
        }
        else {
            res.json({ error: "Bad request" });
        }
    }
    catch (e) {
        res.json({ error: e });
    }
}


exports.bookParking = async (req, res) => {

    try {
       if (req.body.locationId && req.body.bayNumber && req.body.registrationNumber) {
             console.log(req.body);
            var twinId = req.body.locationId + "_" + req.body.bayNumber;
            const credential = new DefaultAzureCredential();
            const serviceClient = new DigitalTwinsClient(digitalTwinsUrl, credential);
            const twinPatch = [
                { op: "replace", path: "/IsOccupied", value: false },
                { op: "add", path: "/RegistrationNumber", value: req.body.registrationNumber},
                { op: "add", path: "/BookingDateTime", value: new Date().toISOString()}
            ];
          
            const updatedTwin = await serviceClient.updateDigitalTwin(twinId, twinPatch);
            res.json({ message: "Booking Successful" });
        }

        else {
            res.json({ error: "Bad request" });
        }
    }
    catch (e) {
        res.json({ error: e });
    }
}