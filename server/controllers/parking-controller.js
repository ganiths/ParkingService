// get parking slots
require("../config/config.js");
const CosmosClient = require("@azure/cosmos").CosmosClient;
const endpoint =  process.env.endpoint || global.gConfig.endpoint;
const key =  process.env.key || global.gConfig.key;
const client = new CosmosClient({ endpoint, key });

const database = client.database(global.gConfig.databaseId);
const container = database.container(global.gConfig.containerId);

exports.getParkingSlots = async (req, res) => {
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

        res.json({
            items,
        });
    }
    else {
        res.json({ error: "Bad request" });
    }
}