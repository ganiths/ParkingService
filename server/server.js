// local - import dependencies and initialize express
require("../server/config/config.js");

const express = require("express");

const healthRoutes = require("./routes/health-route");
const swaggerRoutes = require("./routes/swagger-route");
const parkingRoutes = require("./routes/parking-route");

const app = express();

// routes and api calls
app.use("/health", healthRoutes);
app.use("/swagger", swaggerRoutes);
app.use("/parking", parkingRoutes);

// start node server
const port = process.env.PORT || global.gConfig.port;

app.listen(port, () => {
    console.log(`API available http://localhost:${port}`);
    console.log(
        `Swagger UI available http://localhost:${port}/swagger/api-docs`
    );
});
module.exports = app;
